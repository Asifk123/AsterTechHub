"use client";

import React, { useState } from "react";
import { Meeting } from "../../admin/data";

interface MeetingsTabProps {
  initialMeetings: Meeting[];
}

export default function MeetingsTab({ initialMeetings }: MeetingsTabProps) {
  const [meetings, setMeetings] = useState(initialMeetings);

  const handleClear = (id: number) => {
    setMeetings(meetings.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="mb-8">
        <h3 className="text-xl font-headline mb-1">Company Meetings</h3>
        <p className="text-sm text-on-surface-variant">Mandatory internal syncs scheduled by the CEO.</p>
      </div>

      {meetings.length > 0 ? (
        <div className="grid gap-6">
          {meetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className={`glass-panel border-white/5 rounded-3xl overflow-hidden relative group transition-all duration-500 hover:border-primary/30 ${
                meeting.priority === 'High' ? 'ring-1 ring-primary/20 bg-primary/5' : ''
              }`}
            >
              {/* Mandatory Pulse Effect */}
              {meeting.priority === 'High' && (
                <div className="absolute top-0 right-0 p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Must Attend</span>
                  </div>
                </div>
              )}

              <div className="p-8 flex flex-col md:flex-row gap-8">
                {/* Time & Date */}
                <div className="flex flex-col items-center justify-center bg-surface-container-low rounded-2xl p-6 min-w-[140px] border border-white/5 shadow-inner">
                  <span className="text-3xl font-black text-white">{meeting.time}</span>
                  <span className="text-xs font-bold text-primary uppercase tracking-widest mt-1">{meeting.date}</span>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h4 className="text-2xl font-headline font-bold mb-3 text-white group-hover:text-primary transition-colors leading-tight">
                    {meeting.title}
                  </h4>
                  <p className="text-on-surface-variant leading-relaxed mb-6">
                    {meeting.description?.includes('Type: ') ? meeting.description.split(' | ').slice(1).join(' | ') : meeting.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2 border border-white/5">
                      <span className="material-symbols-outlined text-sm text-secondary">
                        {meeting.description?.includes('Type: Phone') ? 'phone_in_talk' : meeting.description?.includes('Type: In-Person') ? 'location_on' : 'video_camera_front'}
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">
                        {meeting.description?.includes('Type: ') ? meeting.description.split(' | ')[0].replace('Type: ', '') : ((meeting as any).type || 'Video Call')}
                      </span>
                    </div>
                    <div className="px-4 py-2 bg-white/5 rounded-xl flex items-center gap-2 border border-white/5">
                      <span className="material-symbols-outlined text-sm text-primary">groups</span>
                      <span className="text-xs font-bold text-white uppercase tracking-tighter">Whole Team</span>
                    </div>
                  </div>
                </div>

                {/* Action */}
                <div className="flex flex-col justify-center">
                  <button 
                    onClick={() => handleClear(meeting.id)}
                    className="px-8 py-4 bg-primary text-on-primary rounded-xl font-headline font-black text-sm uppercase tracking-widest shadow-[0_0_30px_rgba(0,212,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"
                  >
                    I'll Attend
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center animate-in zoom-in duration-700">
          <div className="w-20 h-20 bg-surface-container-low rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 opacity-50">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">calendar_today</span>
          </div>
          <h4 className="text-xl font-headline font-bold mb-2 text-white">No Upcoming Meetings</h4>
          <p className="text-on-surface-variant text-sm max-w-xs mx-auto">
            Great! You are all caught up. No mandatory meetings scheduled at the moment.
          </p>
        </div>
      )}

      {/* Preparation Guidelines */}
      {meetings.length > 0 && (
        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 flex gap-4 items-start animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <span className="material-symbols-outlined text-secondary">info</span>
          <div>
            <h5 className="text-sm font-headline font-bold text-white mb-1">Meeting Guidelines</h5>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Please ensure your webcam and microphone are working. Be ready 5 minutes before the scheduled time with your relevant reports and task updates.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
