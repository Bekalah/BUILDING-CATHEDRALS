import React, { useState } from 'react';

export function ApprenticeInterface({ teacherData, onExit }) {
  const [currentTask, setCurrentTask] = useState(0);
  const tasks = [
    {
      title: "Study the Masters",
      description: `Learn from ${teacherData.realMasters.join(', ')}`,
      action: "Research their works and principles"
    },
    {
      title: "Enter the Lab",
      description: "Work with sacred geometry and harmonics",
      action: "Create your first fractal composition"
    },
    {
      title: "Produce Your Work",
      description: `Generate: ${teacherData.outputs.join(', ')}`,
      action: "Your creation becomes part of the Cathedral"
    }
  ];

  return (
    <div className="absolute inset-0 bg-black bg-opacity-80 z-20 flex items-center justify-center p-8">
      <div className="bg-[#0a0e17] border border-[#FFD700] rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#FFD700]">{teacherData.name}</h2>
          <button 
            onClick={onExit}
            className="bg-[#4A90E2] text-white px-4 py-2 rounded hover:bg-[#3A70C2] transition-colors"
          >
            Return to Cathedral
          </button>
        </div>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-xl text-[#8888FF] mb-2">Discipline</h3>
            <p className="text-white">{teacherData.discipline}</p>
            <p className="text-gray-300 mt-2 text-sm">{teacherData.description}</p>
          </div>
          <div>
            <h3 className="text-xl text-[#8888FF] mb-2">Real Masters</h3>
            <ul className="text-white list-disc list-inside text-sm">
              {teacherData.realMasters.map((master, i) => (
                <li key={i}>{master}</li>
              ))}
            </ul>
            <h3 className="text-xl text-[#8888FF] mt-4 mb-2">Inspirations</h3>
            <ul className="text-gray-300 text-xs list-disc list-inside">
              {teacherData.inspiration.map((insp, i) => (
                <li key={i}>{insp}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl text-[#8888FF] mb-3">Your Path</h3>
          <div className="space-y-3">
            {tasks.map((task, i) => (
              <div 
                key={i} 
                className={`p-3 rounded border text-sm ${
                  i === currentTask ? 'border-[#FFD700] bg-[#1a1e27]' : 'border-gray-600'
                }`}
              >
                <h4 className="font-semibold text-white">{task.title}</h4>
                <p className="text-gray-300 text-xs">{task.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
