/**
 * GET /api/recruiter/placements
 * Get placement statistics and highlights.
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { protectRouteByRole } from '@/lib/auth';
import Placement from '@/models/Placement';

export async function GET(request: NextRequest) {
  const auth = protectRouteByRole(request, ['COMPANY', 'ADMIN', 'SUPERADMIN']);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDatabase();

    // Get all verified placements
    const placements = await Placement.find({ isVerified: true })
      .sort({ joiningDate: -1 })
      .lean();

    const totalPlaced = placements.length;

    // Calculate average package
    const avgPackage = placements.length > 0
      ? placements.reduce((sum, p) => sum + p.packageAmount, 0) / placements.length
      : 0;

    // Get top hiring companies (by count)
    const companyCount: Record<string, number> = {};
    placements.forEach(p => {
      companyCount[p.companyName] = (companyCount[p.companyName] || 0) + 1;
    });

    const topCompanies = Object.entries(companyCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    // Get recent placements (last 10)
    const recentPlacements = placements.slice(0, 10).map(p => ({
      studentName: p.studentName,
      companyName: p.companyName,
      jobTitle: p.jobTitle,
      packageAmount: p.packageAmount,
      joiningDate: p.joiningDate,
      placementType: p.placementType,
    }));

    // Get highest package
    const highestPackage = placements.length > 0
      ? Math.max(...placements.map(p => p.packageAmount))
      : 0;

    return NextResponse.json({
      success: true,
      placements: {
        totalPlaced,
        avgPackage: Math.round(avgPackage),
        highestPackage,
        topCompanies,
        recentPlacements,
      },
    });

  } catch (err: any) {
    console.error('[Placements GET]', err.message);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
