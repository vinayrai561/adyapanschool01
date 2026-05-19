/**
 * Models Index — Adyapan Backend
 *
 * Central export for all Mongoose models.
 * Import from here to keep controller imports clean:
 *
 *   const { User, Payment, Enrollment } = require('../models');
 */

const User                  = require('./User');
const Payment               = require('./Payment');
const Course                = require('./Course');
const Enrollment            = require('./Enrollment');
const Certificate           = require('./Certificate');
const RecruiterJob          = require('./RecruiterJob');
const RecruiterShortlist    = require('./RecruiterShortlist');
const ProjectRequest        = require('./ProjectRequest');
const ProjectPayment        = require('./ProjectPayment');
const WorkSubmission        = require('./WorkSubmission');
const OfflineInternshipLead = require('./OfflineInternshipLead');
const CounsellorRequest     = require('./CounsellorRequest');
const EmailLog              = require('./EmailLog');

module.exports = {
  User,
  Payment,
  Course,
  Enrollment,
  Certificate,
  RecruiterJob,
  RecruiterShortlist,
  ProjectRequest,
  ProjectPayment,
  WorkSubmission,
  OfflineInternshipLead,
  CounsellorRequest,
  EmailLog,
};
