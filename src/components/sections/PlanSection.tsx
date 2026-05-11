import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BlockIcon, KeystoneIcon, CornerstoneIcon, FrameworkIcon } from '../ui/ArchitecturalIcons';

const plans = [
  {
    id: 'capstone',
    name: 'Capstone',
    label: 'Framework',
    description: 'Strategic infrastructure for agencies ready to transition from manual to automated workflows.',
    features: ['Custom Website', 'Tailwind/Shadcn UI', 'Behavioral Analytics', '99.9% Uptime', 'Secure Auth', 'Change Mgmt'],
    scale: 40,
    Icon: BlockIcon
  },
  {
    id: 'keystone',
    name: 'Keystone',
    label: 'Assembly',
    description: 'Advanced custom engineering. Full integration of the n8n automation engine and client portals.',
    features: ['Advanced n8n Flows', 'Admin/Client Portals', 'Recruitment Sys', 'AI Chatbot', '10k Auto-runs/mo', 'Wise Integration'],
    scale: 65,
    Icon: KeystoneIcon
  },
  {
    id: 'cornerstone',
    name: 'Cornerstone',
    label: 'Core System',
    description: 'The definitive Agency Operating System (AOS). Complete operational control in one unified environment.',
    features: ['All-in-One AOS', 'Finance/Mgmt Hubs', 'SOP Training Hub', 'Employee Workspace', '50k Auto-runs/mo', 'Scale-on-Demand'],
    scale: 100,
    Icon: CornerstoneIcon
  },
  {
    id: 'custom',
    name: 'Customer',
    label: 'Ecosystem',
    description: 'Bespoke architectural solutions. We build exactly how your agency thinks.',
    features: ['Blank Canvas Architecture', 'Deep Integration', 'Dedicated Team', 'Custom AI Agents'],
    scale: 100,
    Icon: FrameworkIcon
  }
];

export function PlanSection() {
  const [activeTab, setActiveTab] = useState<string | null>('keystone');
  
  return (
    <section className="relative min-h-screen md:h-screen w-full bg-transparent flex flex-col overflow-hidden select-none font-sans">
      
      {/* Left-aligned Architectural Header */}
      <div className="pt-24 px-6 md:px-12 pb-8 md:pb-16 shrink-0 z-20 w-full flex flex-col items-start text-left">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-mono text-xs md:text-sm text-[#64FFDA] tracking-[0.2em] uppercase mb-4"
        >
          Pricing
        </motion.div>
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl lg:text-[10rem] font-display font-bold text-[#F8F9FA] tracking-tighter leading-[0.85] uppercase w-full text-left"
        >
          PLANS
        </motion.h2>
      </div>

      {/* Main Interactive Grid */}
      <div className="flex-1 flex flex-col md:flex-row w-full overflow-y-auto md:overflow-hidden bg-transparent">
        {plans.map((plan, index) => {
          const isExpanded = activeTab === plan.id;
          const Icon = plan.Icon;

          return (
            <motion.div
              key={plan.id}
              onMouseEnter={() => window.innerWidth >= 768 && setActiveTab(plan.id)}
              onClick={() => setActiveTab(plan.id)}
              animate={{ 
                flex: isExpanded ? 5 : 2.5,
                // Always use auto height on mobile so content is never clipped
                height: 'auto',
              }}
              transition={{ 
                type: 'spring',
                stiffness: 250,
                damping: 32,
              }}
              className="relative min-w-[150px] md:min-w-[280px] md:h-full group border-t border-[#8892B0]/10 md:border-t-0 md:border-r last:border-r-0 cursor-pointer overflow-hidden will-change-[flex,height]"
            >
              <div className="relative h-full w-full p-6 md:p-12 flex flex-col justify-between overflow-hidden">
                
                <div className="w-full max-w-2xl relative z-10">
                  <div className="mb-2 md:mb-8">
                    <motion.div 
                      animate={{ 
                          opacity: isExpanded ? 0.6 : 0.2 
                      }}
                      className="font-mono text-[9px] md:text-[10px] text-[#64FFDA] tracking-[0.3em] uppercase"
                    >
                      {plan.label} // 0{index + 1}
                    </motion.div>
                  </div>

                  <div className="mb-4 md:mb-10">
                    <div className="overflow-hidden min-h-[30px] md:min-h-[100px] flex items-end">
                        <motion.h3 
                          animate={{ 
                              // On desktop, scale down significantly (0.38) when collapsed to fit within 280px card
                              scale: isExpanded ? 1 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.8 : 0.38),
                              originX: 0,
                              originY: 1,
                              opacity: isExpanded ? 1 : 0.4,
                          }}
                          className="font-display font-bold text-[#F8F9FA] text-2xl md:text-6xl tracking-tighter uppercase leading-none will-change-transform whitespace-nowrap"
                        >
                          {plan.name}
                        </motion.h3>
                    </div>
                    
                    <motion.div 
                      animate={{ 
                          width: isExpanded ? '6rem' : '1.5rem',
                          opacity: isExpanded ? 1 : 0.1,
                          marginTop: isExpanded ? '1rem' : '0.25rem'
                      }}
                      className="h-1 bg-[#64FFDA]" 
                    />
                  </div>

                  {/* Details - Always visible on both Desktop and Mobile */}
                  <motion.div
                    animate={{ 
                      opacity: isExpanded ? 1 : 0.5,
                    }}
                    className="overflow-hidden"
                  >
                    <p className="text-[#8892B0] text-sm md:text-lg leading-relaxed max-w-lg font-sans mb-6 md:mb-8">
                      {plan.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-y-3 md:gap-y-4 pb-8 md:pb-0">
                        {plan.features.map((feature, i) => (
                        <motion.div 
                            key={feature}
                            animate={{ opacity: isExpanded ? 1 : 0.6 }}
                            transition={{ delay: 0.1 + (i * 0.04) }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                            <span className="text-[9px] md:text-xs text-[#CCD6F6] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                            {feature}
                            </span>
                        </motion.div>
                        ))}
                    </div>
                  </motion.div>
                </div>

                {/* Bottom Visual Anchors - Icon only shown when expanded */}
                <div className="hidden md:flex justify-between items-end relative shrink-0 mt-8">
                  <div />
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="absolute bottom-0 right-0 w-48 h-48 md:w-80 md:h-80 pointer-events-none select-none z-0"
                      >
                        <Icon className="w-full h-full" isHovered={isExpanded} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
