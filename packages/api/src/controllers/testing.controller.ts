/**
 * TESTING CONTROLLER
 * World-Class Athletics Performance System
 *
 * API endpoints for test entry and retrieval
 * Event-wise test filtering
 */

import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';

// ============================================
// CREATE TEST RESULT
// ============================================

export const createTestResult = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const {
      athleteId,
      testType,
      testDate,
      value,
      unit,
      secondaryValue,
      conditions,
      equipment,
      notes,
      videoUrl,
      testedBy
    } = req.body;

    // Validate athlete exists
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId }
    });

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    // Create performance test record
    const testResult = await prisma.performanceTest.create({
      data: {
        athleteId,
        testType,
        testDate: new Date(testDate),
        value: parseFloat(value),
        unit,
        secondaryValue: secondaryValue ? parseFloat(secondaryValue) : null,
        conditions,
        equipment,
        notes,
        videoUrl,
        testedBy
      }
    });

    return res.status(201).json({
      success: true,
      data: testResult,
      message: 'Test result recorded successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TEST RESULTS FOR ATHLETE
// ============================================

export const getAthleteTestResults = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { athleteId } = req.params;
    const { testType, startDate, endDate, limit = 50 } = req.query;

    const where: any = { athleteId };

    if (testType) {
      where.testType = testType;
    }

    if (startDate || endDate) {
      where.testDate = {};
      if (startDate) where.testDate.gte = new Date(startDate as string);
      if (endDate) where.testDate.lte = new Date(endDate as string);
    }

    const results = await prisma.performanceTest.findMany({
      where,
      orderBy: { testDate: 'desc' },
      take: parseInt(limit as string)
    });

    res.json({
      success: true,
      data: results,
      count: results.length
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET TEST HISTORY FOR PLOTTING
// ============================================

export const getTestHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { athleteId, testType } = req.params;
    const { months = 6 } = req.query;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - parseInt(months as string));

    const results = await prisma.performanceTest.findMany({
      where: {
        athleteId,
        testType: testType as any,
        testDate: { gte: startDate }
      },
      orderBy: { testDate: 'asc' },
      select: {
        id: true,
        testDate: true,
        value: true,
        secondaryValue: true,
        notes: true
      }
    });

    // Transform for plotting
    const plotData = results.map(r => ({
      date: r.testDate.toISOString().split('T')[0],
      value: r.value,
      left: r.secondaryValue ? r.value : undefined,
      right: r.secondaryValue || undefined,
      notes: r.notes
    }));

    // Calculate statistics
    const values = results.map(r => r.value);
    const stats = {
      count: values.length,
      current: values[values.length - 1],
      best: Math.min(...values), // Will be adjusted based on test type
      worst: Math.max(...values),
      average: values.reduce((a, b) => a + b, 0) / values.length,
      trend: values.length >= 2
        ? ((values[values.length - 1] - values[values.length - 2]) / values[values.length - 2]) * 100
        : 0
    };

    res.json({
      success: true,
      data: {
        plotData,
        stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ALL TESTS BY CATEGORY FOR ATHLETE
// ============================================

export const getTestsByCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { athleteId } = req.params;

    // Get all tests grouped by type
    const results = await prisma.performanceTest.groupBy({
      by: ['testType'],
      where: { athleteId },
      _count: { testType: true },
      _max: { testDate: true }
    });

    // Get latest value for each test type
    const latestTests = await Promise.all(
      results.map(async (r) => {
        const latest = await prisma.performanceTest.findFirst({
          where: {
            athleteId,
            testType: r.testType
          },
          orderBy: { testDate: 'desc' }
        });
        return {
          testType: r.testType,
          count: r._count.testType,
          lastTested: r._max.testDate,
          latestValue: latest?.value,
          unit: latest?.unit
        };
      })
    );

    res.json({
      success: true,
      data: latestTests
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// UPDATE TEST RESULT
// ============================================

export const updateTestResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await prisma.performanceTest.update({
      where: { id },
      data: {
        ...updateData,
        value: updateData.value ? parseFloat(updateData.value) : undefined,
        secondaryValue: updateData.secondaryValue
          ? parseFloat(updateData.secondaryValue)
          : undefined
      }
    });

    res.json({
      success: true,
      data: updated,
      message: 'Test result updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// DELETE TEST RESULT
// ============================================

export const deleteTestResult = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    await prisma.performanceTest.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Test result deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// GET ATHLETE PERFORMANCE SUMMARY
// ============================================

export const getPerformanceSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { athleteId } = req.params;

    // Get athlete with events
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: {
        events: true,
        performanceTests: {
          orderBy: { testDate: 'desc' },
          take: 100
        }
      }
    });

    if (!athlete) {
      return res.status(404).json({
        success: false,
        error: 'Athlete not found'
      });
    }

    // Group tests by type and get latest + best
    const testSummary: Record<string, any> = {};

    for (const test of athlete.performanceTests) {
      const type = test.testType;
      if (!testSummary[type]) {
        testSummary[type] = {
          testType: type,
          count: 0,
          latest: null,
          best: null,
          history: []
        };
      }

      testSummary[type].count++;
      testSummary[type].history.push({
        date: test.testDate,
        value: test.value
      });

      if (!testSummary[type].latest) {
        testSummary[type].latest = {
          date: test.testDate,
          value: test.value
        };
      }

      // Track best (assuming lower is better for time tests)
      if (!testSummary[type].best || test.value < testSummary[type].best.value) {
        testSummary[type].best = {
          date: test.testDate,
          value: test.value
        };
      }
    }

    return res.json({
      success: true,
      data: {
        athlete: {
          id: athlete.id,
          category: athlete.category,
          events: athlete.events
        },
        testSummary: Object.values(testSummary),
        totalTests: athlete.performanceTests.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// ============================================
// COMPARE WITH BENCHMARKS
// ============================================

export const compareWithBenchmarks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { athleteId } = req.params;

    // Get athlete details
    const athlete = await prisma.athlete.findUnique({
      where: { id: athleteId },
      include: {
        events: { where: { isPrimary: true } }
      }
    });

    if (!athlete || !athlete.events.length) {
      return res.status(404).json({
        success: false,
        error: 'Athlete or primary event not found'
      });
    }

    const primaryEvent = athlete.events[0];

    // Get benchmarks for event
    const benchmarks = await prisma.eliteBenchmark.findFirst({
      where: {
        eventType: primaryEvent.eventType,
        gender: athlete.gender,
        category: athlete.category
      }
    });

    // Get latest test results
    const latestTests = await prisma.performanceTest.findMany({
      where: { athleteId },
      orderBy: { testDate: 'desc' },
      distinct: ['testType']
    });

    // Compare with benchmarks
    const comparison = latestTests.map(test => {
      const benchmarkData = benchmarks?.benchmarks as any;
      const testBenchmark = benchmarkData?.[test.testType];

      return {
        testType: test.testType,
        currentValue: test.value,
        unit: test.unit,
        benchmark: testBenchmark,
        percentOfElite: testBenchmark?.elite
          ? (test.value / testBenchmark.elite) * 100
          : null
      };
    });

    return res.json({
      success: true,
      data: {
        athlete: {
          id: athlete.id,
          category: athlete.category,
          gender: athlete.gender,
          event: primaryEvent.eventType
        },
        eventBenchmarks: benchmarks,
        comparison
      }
    });
  } catch (error) {
    next(error);
  }
};
