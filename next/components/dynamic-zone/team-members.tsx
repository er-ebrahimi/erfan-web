'use client';

import React from 'react';

import { BlurImage } from '@/components/blur-image';
import { strapiImage } from '@/lib/strapi/strapiImage';

type Position = {
  Position?: string;
};

type Member = {
  Title?: string;
  Description?: string;
  Profile?: any;
  Positions?: Position[];
  id?: number;
};

export const TeamMembers: React.FC<{
  Title?: string;
  Description?: string;
  Member?: Member[]; // kept the user's spelling to match incoming data
  locale?: string;
}> = ({ Title, Description, Member = [] }) => {
  const url = process.env.NEXT_PUBLIC_API_URL || '';

  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 flex justify-center flex-col items-center">
        {Title && <h2 className="text-3xl font-semibold mb-2">{Title}</h2>}
        {Description && <p className="text-muted mb-6">{Description}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Member.map((m) => (
            <article
              key={m.id || m.Title}
              className=" rounded-lg p-8 flex flex-col items-center text-center justify-center"
            >
              {m.Profile && (
                <div className="w-32 h-32 mb-2 rounded-full overflow-hidden">
                  <BlurImage
                    src={strapiImage(m.Profile.url || m.Profile)}
                    width={128}
                    height={128}
                    alt={m.Title || 'Profile'}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              {m.Positions && m.Positions.length > 0 && (
                <ul className="mt-3 text-xs space-y-1 flex flex-wrap justify-center gap-2">
                  {m.Positions.map((p, idx) => (
                    <li
                      key={idx}
                      style={{ marginTop: '0' }}
                      className="bg-gray-800 rounded-full px-2 mt-0 list-none"
                    >
                      {p.Position}
                    </li>
                  ))}
                </ul>
              )}

              {m.Title && <h2 className="text-lg font-bold mt-2">{m.Title}</h2>}
              {m.Description && (
                <p className="text-sm text-muted mt-1">{m.Description}</p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamMembers;
