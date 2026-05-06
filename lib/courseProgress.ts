interface Lesson {
  id: string;
}

interface Module {
  lessons?: Lesson[] | null;
}

export function calculateTotalLessons(modules: Module[] | null): number {
  if (!modules) return 0;
  return modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0
  );
}

export function calculateCourseProgress(
  modules: Module[] | null,
  completedLessonIds: string[]
): number {
  const totalLessons = calculateTotalLessons(modules);
  const totalCompleted = completedLessonIds.length;

  return Math.round(
    totalLessons > 0 ? (totalCompleted / totalLessons) * 100 : 0
  );
}
