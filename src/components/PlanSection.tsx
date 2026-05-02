import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlateIcon, BlockIcon, KeystoneIcon, CornerstoneIcon, FrameworkIcon } from './ArchitecturalIcons';

const plans = [
  {
    id: 'free',
    name: 'Free',
    label: 'Foundation',
    description: 'Entry-level access to the Cornerstone architecture. Perfect for identifying core bottlenecks.',
    features: ['Consultation Call', 'Bottleneck Analysis', 'Templated Design', '24h Delivery'],
    scale: 20,
    Icon: PlateIcon
  },
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
    <section className="relative min-h-screen md:h-screen w-full bg-[#F8F9FA] dark:bg-[#0A192F] flex flex-col overflow-hidden select-none border-b border-slate-200 dark:border-[#8892B0]/10 font-sans">
      
      {/* Centered Architectural Header */}
      <div className="pt-24 px-6 md:px-12 pb-16 shrink-0 z-20 flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] tracking-[0.1em] uppercase leading-none"
        >
          Architectural Tiers
        </motion.h2>
      </div>

      {/* Main Interactive Grid - Switched to column on mobile */}
      <div className="flex-1 flex flex-col md:flex-row w-full border-t border-slate-200 dark:border-[#8892B0]/10 overflow-hidden bg-transparent">
        {plans.map((plan, index) => {
          const isExpanded = activeTab === plan.id;
          const Icon = plan.Icon;

          return (
            <motion.div
              key={plan.id}
              onMouseEnter={() => setActiveTab(plan.id)}
              onClick={() => setActiveTab(plan.id)} // Touch support
              animate={{ 
                flex: isExpanded ? 5 : 2.5, // Increased base flex for readability
                // On mobile we expand height instead of width
                height: typeof window !== 'undefined' && window.innerWidth < 768 
                  ? (isExpanded ? '450px' : '100px') 
                  : 'auto'
              }}
              transition={{ 
                type: 'spring',
                stiffness: 250,
                damping: 32,
                restDelta: 0.001
              }}
              className="relative min-w-[150px] md:min-w-[280px] md:h-full group border-b md:border-b-0 md:border-r border-slate-200 dark:border-[#8892B0]/10 last:border-r-0 last:border-b-0 cursor-pointer overflow-hidden will-change-[flex,height]"
              style={{ flexBasis: 0 }}
            >
              {/* Material Backdrop - Subtle highlight when expanded */}
              <motion.div 
                animate={{ 
                    opacity: isExpanded ? 1 : 0,
                }}
                className="absolute inset-0 pointer-events-none will-change-opacity bg-white dark:bg-[#112240]/20" 
              />

              <div className="relative h-full w-full p-6 md:p-12 flex flex-col justify-between overflow-hidden">
                
                {/* Content Container - Switched to fluid max-w */}
                <div className="w-full max-w-2xl relative z-10" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
                  <div className="mb-4 md:mb-8">
                    <motion.div 
                      animate={{ 
                          y: isExpanded ? 0 : 5, 
                          opacity: isExpanded ? 0.6 : 0.2 
                      }}
                      className="font-mono text-[10px] text-teal-500 dark:text-[#64FFDA] tracking-[0.3em] uppercase"
                    >
                      {plan.label} // 0{index + 1}
                    </motion.div>
                  </div>

                  <div className="mb-6 md:mb-10">
                    <div className="overflow-hidden min-h-[40px] md:min-h-[100px] flex items-end">
                        <motion.h3 
                          animate={{ 
                              scale: isExpanded ? 1 : (typeof window !== 'undefined' && window.innerWidth < 768 ? 0.6 : 0.4),
                              originX: 0,
                              originY: 1,
                              opacity: isExpanded ? 1 : 0.4,
                          }}
                          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                          className="font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] text-3xl md:text-6xl tracking-tighter uppercase leading-none will-change-transform"
                        >
                          {plan.name}
                        </motion.h3>
                    </div>
                    
                    <motion.div 
                      animate={{ 
                          width: isExpanded ? '8rem' : '1.5rem',
                          opacity: isExpanded ? 1 : 0.1,
                          marginTop: isExpanded ? '1.5rem' : '0.5rem'
                      }}
                      className="h-1.5 bg-teal-500 dark:bg-[#64FFDA] will-change-[width]" 
                    />
                  </div>

                  {/* Description - Always visible but slightly faded when minimized */}
                  <div className="mt-4 md:mt-6">
                    <motion.p 
                      animate={{ 
                        opacity: isExpanded ? 1 : 0.5,
                        scale: isExpanded ? 1 : 0.9,
                        originX: 0
                      }}
                      className="text-[#0A192F]/80 dark:text-[#8892B0] text-sm md:text-lg leading-relaxed max-w-lg font-sans mb-8"
                    >
                      {plan.description}
                    </motion.p>
                  </div>

                  {/* Features - Only visible when expanded for focus */}
                  <AnimatePresence mode="wait">
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="grid grid-cols-1 gap-y-3 md:gap-y-4 pt-6 border-t border-slate-100 dark:border-[#8892B0]/10">
                            {plan.features.map((feature, i) => (
                            <motion.div 
                                key={feature}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + (i * 0.04) }}
                                className="flex items-center gap-3"
                            >
                                <div className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                                <span className="text-[10px] md:text-xs text-[#0A192F] dark:text-[#CCD6F6] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                                {feature}
                                </span>
                            </motion.div>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom Visual Anchors */}
                <div className="flex justify-between items-end relative shrink-0 mt-8">
                  <motion.div 
                    animate={{ 
                        opacity: isExpanded ? 1 : 0.15,
                        scale: isExpanded ? 1 : 0.95
                    }}
                    className="flex flex-col gap-3 mb-2"
                  >
                     <span className="text-[9px] font-mono text-[#8892B0] uppercase tracking-widest opacity-50">Stability_Index</span>
                     <div className="w-32 md:w-40 h-[2px] bg-slate-200 dark:bg-white/5 relative">
                        <motion.div 
                          animate={{ width: `${plan.scale}%` }}
                          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
                          className="absolute top-0 left-0 h-full bg-teal-500 dark:bg-[#64FFDA] shadow-[0_0_15px_rgba(100,255,218,0.6)]"
                        />
                     </div>
                  </motion.div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.5, x: 50 }}
                        animate={{ opacity: 0.4, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5, x: 50, transition: { duration: 0.3 } }}
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
