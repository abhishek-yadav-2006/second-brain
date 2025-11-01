import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { CreateContentModel } from '../components/CreateContentModel';
import { Sidebar } from '../components/Sidebar';
import { useContent } from '../hooks/useContent';
import { PlusIcon } from '../icons/PlusIcon';
import { ShareIcon } from '../icons/ShareIcon';
import { useState } from 'react';



interface Content {
  _id: string;
  title: string;
  link: string;
  type: "youtube" | "twitter";
}


export function DashBoard() {
  const [modelOpen, setModelOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All"); // Dashboard will use this filter
  const contents: Content[] = useContent();




  const filteredContents = contents.filter((content) => {
    if (activeFilter.toLowerCase() === "all") return true;
    return content.type.toLowerCase() === activeFilter.toLowerCase();
  });

  return (

    <div className='flex bg-[#F8F9FD] text-[#1A1A1A] min-h-screen'>

      <div className='w-72'>
        <Sidebar onFilterChange={setActiveFilter} />
      </div>

      <div className='flex-1 p-6 bg-[rgb(181,213,219)]'>
        <CreateContentModel open={modelOpen} onClose={() => setModelOpen(false)} />

        <div className="flex justify-end m-0 p-2 w-full bg-[rgb(139,190,200)] rounded  gap-2 mb-6">
 
          <div className=''>
            <Button
              startIcon={<ShareIcon size='md' />}
              size='md'
              varient='primary'
              text='Share Brain'
              onClick={() => { }}
            />
          </div>
          <div className='bg-[#E9ECEF] rounded-md hover:bg-[#DEE2E6] transition-all duration-300'>
            <Button
              startIcon={<PlusIcon size='md' />}
              size='md'
              varient='primary'
              text='Add Content'
              onClick={() => setModelOpen(true)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4 perspective-1000">
          {filteredContents.length === 0 ? (
            <p className="text-gray-500 text-center col-span-3">No content found.</p>
          ) : (
            filteredContents.map(({ _id, type, link, title }) => (
              <div
                key={_id}
                className="
          bg-white 
          border border-gray-200 
          rounded-2xl 
          shadow-md 
          hover:shadow-black-5xl 
          transform-gpu 
          transition-all 
          duration-500 
          ease-out 
          hover:-translate-z-3 
          hover:rotate-x-3 
          hover:rotate-z-2 
          hover:scale-[1.03]
          hover:border-[rgb(80,144,157)] 
          hover:border-2
        "
                style={{
                  transformStyle: "preserve-3d",
                }}
              >
                <Card _id={_id} type={type} link={link} title={title} />
              </div>
            ))
          )}
        </div>




      </div>
    </div>
  );
}

export default DashBoard;
