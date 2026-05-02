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
    <section className="relative h-screen min-h-[850px] w-full bg-[#F8F9FA] dark:bg-[#0A192F] flex flex-col overflow-hidden select-none border-b border-slate-200 dark:border-[#8892B0]/10 font-sans">
      
      {/* Centered Architectural Header */}
      <div className="pt-24 px-12 pb-16 shrink-0 z-20 flex flex-col items-center text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-6xl md:text-8xl font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] tracking-[0.1em] uppercase leading-none"
        >
          Architectural Tiers
        </motion.h2>
      </div>

      <div className="flex-1 flex w-full border-t border-slate-200 dark:border-[#8892B0]/10 overflow-hidden bg-[#F0F2F5] dark:bg-[#081221]">
        {plans.map((plan, index) => {
          const isExpanded = activeTab === plan.id;
          const Icon = plan.Icon;

          return (
            <motion.div
              key={plan.id}
              onMouseEnter={() => setActiveTab(plan.id)}
              animate={{ 
                flex: isExpanded ? 6 : 2,
                backgroundColor: isExpanded 
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? '#112240' : 'transparent') 
                  : 'transparent'
              }}
              transition={{ 
                type: 'spring',
                stiffness: 220,
                damping: 32,
                restDelta: 0.001
              }}
              className="relative min-w-0 h-full group border-r border-slate-200 dark:border-[#8892B0]/10 last:border-r-0 cursor-pointer overflow-hidden will-change-[flex]"
              style={{ flexBasis: 0 }}
            >
              <motion.div 
                animate={{ opacity: isExpanded ? 1 : 0 }}
                className="absolute inset-0 bg-white dark:bg-[#112240] pointer-events-none" 
              />

              <div className="relative h-full w-full p-8 md:p-12 flex flex-col justify-between overflow-hidden">
                
                <div className="max-w-2xl relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <motion.div 
                      animate={{ y: isExpanded ? 0 : 5, opacity: isExpanded ? 0.6 : 0.2 }}
                      className="font-mono text-[10px] text-teal-500 dark:text-[#64FFDA] tracking-[0.3em] uppercase"
                    >
                      {plan.label} // 0{index + 1}
                    </motion.div>
                  </div>

                  <div className="mb-10">
                    <div className="flex items-end gap-6 mb-6">
                      <div className="overflow-hidden">
                        <motion.h3 
                          animate={{ 
                              fontSize: isExpanded ? '5rem' : '1.5rem',
                              opacity: isExpanded ? 1 : 0.4,
                          }}
                          transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                          className="font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] tracking-tighter uppercase leading-none will-change-[font-size,opacity]"
                        >
                          {plan.name}
                        </motion.h3>
                      </div>
                    </div>
                    
                    <motion.div 
                      animate={{ 
                          width: isExpanded ? '8rem' : '1.5rem',
                          opacity: isExpanded ? 1 : 0.1,
                          marginTop: isExpanded ? '0rem' : '1rem'
                      }}
                      className="h-2 bg-teal-500 dark:bg-[#64FFDA]" 
                    />
                  </div>

                  <div className="mb-8">
                    <motion.p 
                      animate={{ 
                        fontSize: isExpanded ? '1.25rem' : '0.875rem',
                        lineHeight: isExpanded ? '1.75rem' : '1.25rem',
                        opacity: isExpanded ? 0.8 : 0.25,
                        y: isExpanded ? 0 : 5
                      }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="text-[#0A192F] dark:text-[#8892B0] max-w-lg font-sans will-change-[font-size,opacity,transform]"
                    >
                      {plan.description}
                    </motion.p>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.5, ease: "circOut" }}
                          className="space-y-4 pt-6 border-t border-slate-100 dark:border-[#8892B0]/10 overflow-hidden"
                      >
                         {plan.features.map((feature, i) => (
                           <motion.div 
                              key={feature}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.1 + (i * 0.05) }}
                              className="flex items-center gap-4"
                           >
                             <div className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
                             <span className="text-[10px] md:text-xs text-[#0A192F] dark:text-[#CCD6F6] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                               {feature}
                             </span>
                           </motion.div>
                         ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex justify-between items-end relative shrink-0">
                  <motion.div 
                    animate={{ 
                        opacity: isExpanded ? 1 : 0.2,
                        scale: isExpanded ? 1 : 0.9
                    }}
                    className="flex flex-col gap-3 mb-2"
                  >
                     <span className="text-[9px] font-mono text-[#8892B0] uppercase tracking-widest opacity-50">Stability_Index</span>
                     <div className="w-40 h-[2px] bg-slate-200 dark:bg-white/5 relative">
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
                        initial={{ opacity: 0, scale: 0.5, x: 100, rotate: -10 }}
                        animate={{ opacity: 0.4, scale: 1, x: 0, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, x: 100, rotate: 10, transition: { duration: 0.4 } }}
                        className="absolute bottom-8 right-8 w-80 h-80 pointer-events-none select-none z-0"
                      >
                        <Icon className="w-full h-full" />
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
