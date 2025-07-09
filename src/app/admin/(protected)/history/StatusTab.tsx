import React from 'react'

interface statusProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const StatusTab: React.FC<statusProps> = ({ activeTab, setActiveTab }) => {
    const tabs = ["pending", "completed"]
    return (
        <div>
            <div className='flex items-center w-full justify-between'>
                {
                    tabs.map((item, index) => (
                        <button key={index} onClick={() => setActiveTab(item)} className={`py-4 px-4 font-medium transition flex-1 ${activeTab === item
                            ? 'border-b-2 border-yellow-400 text-white'
                            : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            {item}
                        </button>
                    ))
                }
            </div>
        </div>
    )
}

export default StatusTab