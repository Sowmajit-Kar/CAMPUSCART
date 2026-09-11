const { useState, useEffect, useMemo, useRef } = React;

    function CourseSection({ onEnroll }) {
      const { course } = window.CAMPUS_DATA;
      return (
        <section class="max-w-5xl mx-auto px-6 sm:px-12 pt-32 pb-24 space-y-12">
          <div class="aspect-[21/9] rounded-3xl overflow-hidden bg-neutral-200 shadow-lg">
            <img src={course.heroImage} alt="Course" class="w-full h-full object-cover" />
          </div>
          <div class="text-center space-y-4 max-w-2xl mx-auto">
            <h1 class="font-display text-4xl font-bold text-neutral-950">{course.title}</h1>
            <p class="text-sm text-neutral-500">{course.subtitle}</p>
            <button onClick={onEnroll} class="px-8 py-3 bg-neutral-950 text-white rounded-full text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 shadow-md">
              Enroll with Campus Roll Number
            </button>
          </div>
        </section>
      );
    }

window.CourseSection = CourseSection;
