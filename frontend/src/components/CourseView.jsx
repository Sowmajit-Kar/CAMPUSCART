import React from 'react';
import { CAMPUS_DATA } from '../data/mockData';

function CourseSection({ onEnroll }) {
      const { course } = window.CAMPUS_DATA;
      return (
        <section className="max-w-5xl mx-auto px-6 sm:px-12 pt-32 pb-24 space-y-12">
          <div className="aspect-[21/9] rounded-3xl overflow-hidden bg-neutral-200 shadow-lg">
            <img src={course.heroImage} alt="Course" className="w-full h-full object-cover" />
          </div>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h1 className="font-display text-4xl font-bold text-neutral-950">{course.title}</h1>
            <p className="text-sm text-neutral-500">{course.subtitle}</p>
            <button onClick={onEnroll} className="px-8 py-3 bg-neutral-950 text-white rounded-full text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 shadow-md">
              Enroll with Campus Roll Number
            </button>
          </div>
        </section>
      );
    }

export default CourseSection;
