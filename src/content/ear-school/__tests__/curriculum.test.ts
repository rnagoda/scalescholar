/**
 * Ear School Curriculum Tests
 */

import {
  EAR_SCHOOL_CURRICULUM,
  getSectionById,
  getLessonById,
  getSectionLessons,
  getTotalLessonCount,
} from '../curriculum';

describe('EAR_SCHOOL_CURRICULUM', () => {
  describe('structure', () => {
    it('should have 4 sections', () => {
      expect(EAR_SCHOOL_CURRICULUM.sections).toHaveLength(4);
    });

    it('should have correct section IDs', () => {
      const sectionIds = EAR_SCHOOL_CURRICULUM.sections.map((s) => s.id);
      expect(sectionIds).toEqual([
        'ear-school-section-1',
        'ear-school-section-2',
        'ear-school-section-3',
        'ear-school-section-4',
      ]);
    });

    it('should have correct section numbers', () => {
      EAR_SCHOOL_CURRICULUM.sections.forEach((section, index) => {
        expect(section.number).toBe(index + 1);
      });
    });

    it('should have titles for all sections', () => {
      EAR_SCHOOL_CURRICULUM.sections.forEach((section) => {
        expect(section.title).toBeTruthy();
        expect(typeof section.title).toBe('string');
      });
    });

    it('each section should have lessons and an assessment', () => {
      EAR_SCHOOL_CURRICULUM.sections.forEach((section) => {
        expect(section.lessons.length).toBeGreaterThan(0);
        expect(section.assessment).toBeDefined();
        expect(section.assessment.isAssessment).toBe(true);
      });
    });
  });

  describe('lessons', () => {
    it('all lessons should have required fields', () => {
      EAR_SCHOOL_CURRICULUM.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          expect(lesson.id).toBeTruthy();
          expect(lesson.sectionId).toBe(section.id);
          expect(lesson.sectionNumber).toBe(section.number);
          expect(lesson.title).toBeTruthy();
          expect(lesson.subtitle).toBeTruthy();
          expect(lesson.concept).toBeTruthy();
          expect(lesson.exerciseType).toBeTruthy();
          expect(lesson.questionCount).toBeGreaterThan(0);
          expect(lesson.passThreshold).toBeGreaterThanOrEqual(70);
          expect(typeof lesson.generateQuestion).toBe('function');
        });
      });
    });

    it('lesson IDs should follow naming convention', () => {
      EAR_SCHOOL_CURRICULUM.sections.forEach((section) => {
        section.lessons.forEach((lesson) => {
          // Regular lessons: ear-school-X.Y
          expect(lesson.id).toMatch(/^ear-school-\d+\.\d+$/);
        });
      });
    });

    it('assessment IDs should follow naming convention', () => {
      EAR_SCHOOL_CURRICULUM.sections.forEach((section) => {
        expect(section.assessment.id).toMatch(/^ear-school-\d+-assessment$/);
      });
    });
  });
});

describe('getSectionById', () => {
  it('should return section for valid ID', () => {
    const section = getSectionById('ear-school-section-1');
    expect(section).toBeDefined();
    expect(section?.id).toBe('ear-school-section-1');
    expect(section?.number).toBe(1);
  });

  it('should return undefined for invalid ID', () => {
    expect(getSectionById('invalid-id')).toBeUndefined();
    expect(getSectionById('')).toBeUndefined();
  });

  it('should return all 4 sections', () => {
    for (let i = 1; i <= 4; i++) {
      const section = getSectionById(`ear-school-section-${i}`);
      expect(section).toBeDefined();
      expect(section?.number).toBe(i);
    }
  });
});

describe('getLessonById', () => {
  it('should return lesson for valid ID', () => {
    const lesson = getLessonById('ear-school-1.1');
    expect(lesson).toBeDefined();
    expect(lesson?.id).toBe('ear-school-1.1');
    expect(lesson?.sectionNumber).toBe(1);
    expect(lesson?.lessonNumber).toBe(1);
  });

  it('should return assessment for valid assessment ID', () => {
    const assessment = getLessonById('ear-school-1-assessment');
    expect(assessment).toBeDefined();
    expect(assessment?.id).toBe('ear-school-1-assessment');
    expect(assessment?.isAssessment).toBe(true);
  });

  it('should return undefined for invalid ID', () => {
    expect(getLessonById('invalid-id')).toBeUndefined();
    expect(getLessonById('')).toBeUndefined();
    expect(getLessonById('ear-school-99.99')).toBeUndefined();
  });
});

describe('getSectionLessons', () => {
  it('should return lessons for valid section ID', () => {
    const lessons = getSectionLessons('ear-school-section-1');
    expect(lessons.length).toBeGreaterThan(0);
    lessons.forEach((lesson) => {
      expect(lesson.sectionId).toBe('ear-school-section-1');
    });
  });

  it('should include assessment in returned lessons', () => {
    const lessons = getSectionLessons('ear-school-section-1');
    const assessment = lessons.find((l) => l.isAssessment);
    expect(assessment).toBeDefined();
  });

  it('should return empty array for invalid section ID', () => {
    expect(getSectionLessons('invalid-id')).toEqual([]);
  });
});

describe('getTotalLessonCount', () => {
  it('should return total number of lessons (excluding assessments)', () => {
    const total = getTotalLessonCount();
    // getTotalLessonCount excludes assessments per the function comment
    const expectedTotal = EAR_SCHOOL_CURRICULUM.sections.reduce(
      (sum, section) => sum + section.lessons.length,
      0
    );
    expect(total).toBe(expectedTotal);
    // Should be at least 4 (at least one lesson per section)
    expect(total).toBeGreaterThanOrEqual(4);
  });
});
