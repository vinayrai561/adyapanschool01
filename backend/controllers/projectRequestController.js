/**
 * Project Request Controller
 * 
 * Handles project build requests with payment integration
 * Minimum payment: ₹3000
 */

const crypto = require('crypto');
const ProjectRequest = require('../models/ProjectRequest');
const WorkSubmission = require('../models/WorkSubmission');
const { getRazorpay, verifyPaymentSignature, hasRealKeys } = require('../config/razorpay');

// Minimum project amount
const MIN_PROJECT_AMOUNT = 3000;

/**
 * POST /api/project-request/create-order
 * 
 * Creates a Razorpay order for project submission
 * Validates minimum amount requirement
 */
const createProjectOrder = async (req, res) => {
  try {
    const { budget } = req.body;

    // Validate minimum amount
    if (!budget || budget < MIN_PROJECT_AMOUNT) {
      return res.status(400).json({
        success: false,
        error: `Minimum project submission amount is ₹${MIN_PROJECT_AMOUNT}`,
      });
    }

    const amountPaise = Math.round(budget * 100);

    // TEST MODE: No real Razorpay keys configured
    if (!hasRealKeys()) {
      const mockOrderId = `order_PROJECT_TEST_${Date.now()}`;
      console.log(
        `[ProjectRequest] TEST MODE - Mock order created: ${mockOrderId} | Amount: ₹${budget}`
      );

      return res.json({
        success: true,
        orderId: mockOrderId,
        amount: amountPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
        testMode: true,
      });
    }

    // LIVE MODE: Create real Razorpay order
    try {
      const razorpay = getRazorpay();
      const order = await razorpay.orders.create({
        amount: amountPaise,
        currency: 'INR',
        receipt: `project_${Date.now()}`,
        notes: {
          type: 'project_request',
          budget,
        },
      });

      console.log(
        `[ProjectRequest] ✅ Order created: ${order.id} | Amount: ₹${budget}`
      );

      return res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        testMode: false,
      });
    } catch (razorpayError) {
      console.error('[ProjectRequest] Razorpay API error:', razorpayError.message);
      return res.status(500).json({
        success: false,
        error: 'Failed to create payment order',
      });
    }
  } catch (error) {
    console.error('[ProjectRequest] createProjectOrder error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
};

/**
 * POST /api/project-request/submit
 * 
 * Submits project request after payment verification
 */
const submitProjectRequest = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      projectTitle,
      category,
      description,
      features,
      techPreference,
      deadline,
      budget,
      contactName,
      contactEmail,
      contactPhone,
      imageUrls,
      pdfUrls,
      referenceFiles,
      additionalNotes,
      userId,
    } = req.body;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !projectTitle ||
      !category ||
      !description ||
      !features ||
      !deadline ||
      !budget ||
      !contactName ||
      !contactEmail ||
      !contactPhone
    ) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Validate minimum amount
    if (budget < MIN_PROJECT_AMOUNT) {
      return res.status(400).json({
        success: false,
        error: `Minimum project submission amount is ₹${MIN_PROJECT_AMOUNT}`,
      });
    }

    // SECURITY: Verify signature server-side
    let signatureValid = false;

    if (razorpay_order_id.startsWith('order_PROJECT_TEST_')) {
      console.log(`[ProjectRequest] TEST MODE - Skipping signature verification`);
      signatureValid = true;
    } else {
      try {
        signatureValid = verifyPaymentSignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature
        );
      } catch (error) {
        console.error('[ProjectRequest] Signature verification error:', error.message);
        return res.status(500).json({
          success: false,
          error: 'Signature verification failed',
        });
      }
    }

    if (!signatureValid) {
      console.warn(
        `[ProjectRequest] ❌ INVALID SIGNATURE - Order: ${razorpay_order_id}`
      );
      return res.status(400).json({
        success: false,
        error: 'Payment verification failed - invalid signature',
      });
    }

    // Check for duplicate payment
    const existingRequest = await ProjectRequest.findOne({ paymentId: razorpay_payment_id });
    if (existingRequest) {
      console.log(
        `[ProjectRequest] ⚠️ Duplicate payment detected: ${razorpay_payment_id}`
      );
      return res.json({
        success: true,
        projectRequestId: existingRequest._id,
        duplicate: true,
        message: 'Project request already submitted',
      });
    }

    // Save project request
    const projectRequest = await ProjectRequest.create({
      userId: userId || null,
      projectTitle,
      category,
      description,
      features: Array.isArray(features) ? features : [features],
      techPreference: techPreference || '',
      deadline: new Date(deadline),
      budget,
      contactName,
      contactEmail: contactEmail.toLowerCase().trim(),
      contactPhone,
      imageUrls: imageUrls || [],
      pdfUrls: pdfUrls || [],
      referenceFiles: referenceFiles || [],
      additionalNotes: additionalNotes || '',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      paymentStatus: 'success',
      paidAmount: budget,
      projectStatus: 'submitted',
    });

    console.log(
      `[ProjectRequest] ✅ Project request saved - ID: ${projectRequest._id} | Email: ${contactEmail}`
    );

    // Send confirmation emails
    try {
      const { buildProjectSubmissionEmail, buildAdminNewProjectEmail } = require('../utils/projectEmailTemplates');
      const { sendProjectEmail } = require('../utils/sendEmail');
      // Send to client
      const clientEmail = buildProjectSubmissionEmail({
        name: contactName,
        email: contactEmail,
        projectTitle,
        category,
        budget,
        deadline,
        projectRequestId: projectRequest._id.toString(),
        paymentId: razorpay_payment_id,
      });
      await sendProjectEmail({ to: contactEmail, subject: `✅ Project Request Received — ${projectTitle} | Adyapan`, ...clientEmail });
      // Send to admin
      const adminEmail = buildAdminNewProjectEmail({
        projectTitle, category, budget, contactName, contactEmail, contactPhone,
        projectRequestId: projectRequest._id.toString(),
      });
      if (process.env.ADMIN_EMAIL) {
        await sendProjectEmail({ to: process.env.ADMIN_EMAIL, subject: `🆕 New Project Request — ${projectTitle}`, ...adminEmail });
      }
      await ProjectRequest.findByIdAndUpdate(projectRequest._id, { emailSent: true });
    } catch (emailError) {
      console.error('[ProjectRequest] Email error:', emailError.message);
    }

    return res.json({
      success: true,
      projectRequestId: projectRequest._id,
      message: 'Project request submitted successfully',
    });
  } catch (error) {
    console.error('[ProjectRequest] submitProjectRequest error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit project request',
    });
  }
};

/**
 * GET /api/project-request/my-requests
 * 
 * Get all project requests for logged-in user
 */
const getMyRequests = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    const requests = await ProjectRequest.find({
      contactEmail: email.toLowerCase().trim(),
    })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email');

    return res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('[ProjectRequest] getMyRequests error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch requests',
    });
  }
};

/**
 * GET /api/project-request/all (Admin only)
 * 
 * Get all project requests for admin dashboard
 */
const getAllRequests = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) {
      filter.projectStatus = status;
    }

    const requests = await ProjectRequest.find(filter)
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name email')
      .populate('userId', 'name email');

    return res.json({
      success: true,
      requests,
    });
  } catch (error) {
    console.error('[ProjectRequest] getAllRequests error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch requests',
    });
  }
};

/**
 * PUT /api/project-request/update-status/:id (Admin only)
 * 
 * Update project status and assignment
 */
const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { projectStatus, assignedTo } = req.body;

    const updateData = { projectStatus };

    if (assignedTo) {
      updateData.assignedTo = assignedTo;
      updateData.assignedAt = new Date();
    }

    const projectRequest = await ProjectRequest.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!projectRequest) {
      return res.status(404).json({
        success: false,
        error: 'Project request not found',
      });
    }

    console.log(
      `[ProjectRequest] ✅ Status updated - ID: ${id} | Status: ${projectStatus}`
    );

    return res.json({
      success: true,
      projectRequest,
      message: 'Project status updated successfully',
    });
  } catch (error) {
    console.error('[ProjectRequest] updateProjectStatus error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to update status',
    });
  }
};

/**
 * POST /api/project-request/submit-work
 * 
 * Submit completed work for a project
 */
const submitWork = async (req, res) => {
  try {
    const {
      projectRequestId,
      submittedBy,
      githubLink,
      liveLink,
      reportPdf,
      screenshots,
      notes,
    } = req.body;

    if (!projectRequestId || !submittedBy) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Check if project exists
    const projectRequest = await ProjectRequest.findById(projectRequestId);
    if (!projectRequest) {
      return res.status(404).json({
        success: false,
        error: 'Project request not found',
      });
    }

    // Create work submission
    const workSubmission = await WorkSubmission.create({
      projectRequestId,
      submittedBy,
      githubLink: githubLink || '',
      liveLink: liveLink || '',
      reportPdf: reportPdf || '',
      screenshots: screenshots || [],
      notes: notes || '',
      status: 'submitted',
    });

    // Update project status
    await ProjectRequest.findByIdAndUpdate(projectRequestId, {
      projectStatus: 'completed',
    });

    console.log(
      `[ProjectRequest] ✅ Work submitted - ID: ${workSubmission._id} | Project: ${projectRequestId}`
    );

    return res.json({
      success: true,
      workSubmission,
      message: 'Work submitted successfully',
    });
  } catch (error) {
    console.error('[ProjectRequest] submitWork error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to submit work',
    });
  }
};

/**
 * GET /api/project-request/work-submissions/:projectId
 * 
 * Get all work submissions for a project
 */
const getWorkSubmissions = async (req, res) => {
  try {
    const { projectId } = req.params;

    const submissions = await WorkSubmission.find({
      projectRequestId: projectId,
    })
      .sort({ createdAt: -1 })
      .populate('submittedBy', 'name email')
      .populate('feedbackBy', 'name email');

    return res.json({
      success: true,
      submissions,
    });
  } catch (error) {
    console.error('[ProjectRequest] getWorkSubmissions error:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch submissions',
    });
  }
};

module.exports = {
  createProjectOrder,
  submitProjectRequest,
  getMyRequests,
  getAllRequests,
  updateProjectStatus,
  submitWork,
  getWorkSubmissions,
};
