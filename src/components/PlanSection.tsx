import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Entry-level access to the Cornerstone architecture. Perfect for identifying core bottlenecks.',
    features: ['Consultation Call', 'Bottleneck Analysis', 'Templated Design', '24h Delivery'],
    scale: 20,
  },
  {
    id: 'capstone',
    name: 'Capstone',
    description: 'Strategic infrastructure for agencies ready to transition from manual to automated workflows.',
    features: ['Custom Website', 'Tailwind/Shadcn UI', 'Behavioral Analytics', '99.9% Uptime', 'Secure Auth', 'Change Mgmt'],
    scale: 40,
  },
  {
    id: 'keystone',
    name: 'Keystone',
    description: 'Advanced custom engineering. Full integration of the n8n automation engine and client portals.',
    features: ['Advanced n8n Flows', 'Admin/Client Portals', 'Recruitment Sys', 'AI Chatbot', '10k Auto-runs/mo', 'Wise Integration'],
    scale: 65,
  },
  {
    id: 'cornerstone',
    name: 'Cornerstone',
    description: 'The definitive Agency Operating System (AOS). Complete operational control in one unified environment.',
    features: ['All-in-One AOS', 'Finance/Mgmt Hubs', 'SOP Training Hub', 'Employee Workspace', '50k Auto-runs/mo', 'Scale-on-Demand'],
    scale: 100,
  },
  {
    id: 'custom',
    name: 'Customer',
    description: 'Bespoke architectural solutions. We build exactly how your agency thinks.',
    features: ['Blank Canvas Architecture', 'Deep Integration', 'Dedicated Team', 'Custom AI Agents'],
    scale: 100,
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
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            onMouseEnter={() => setActiveTab(plan.id)}
            animate={{ 
              flex: activeTab === plan.id ? 6 : 2,
              backgroundColor: activeTab === plan.id 
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
            {/* Smooth hover backdrop */}
            <motion.div 
              animate={{ opacity: activeTab === plan.id ? 1 : 0 }}
              className="absolute inset-0 bg-white dark:bg-[#112240] pointer-events-none" 
            />

            <div className="relative h-full w-full p-8 md:p-12 flex flex-col justify-between overflow-hidden">
              
              <div className="max-w-2xl relative z-10">
                <div className="overflow-hidden mb-8">
                  <motion.div 
                    animate={{ y: activeTab === plan.id ? 0 : 5, opacity: activeTab === plan.id ? 0.6 : 0.2 }}
                    className="font-mono text-[10px] text-teal-500 dark:text-[#64FFDA] tracking-widest"
                  >
                    SYS_MODULE_0{index + 1}
                  </motion.div>
                </div>

                <div className="mb-10">
                  <div className="overflow-hidden">
                    <motion.h3 
                      animate={{ 
                          fontSize: activeTab === plan.id ? '5rem' : '1.5rem',
                          opacity: activeTab === plan.id ? 1 : 0.4,
                      }}
                      transition={{ type: 'spring', stiffness: 150, damping: 25 }}
                      className="font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] tracking-tighter uppercase leading-none will-change-[font-size,opacity]"
                    >
                      {plan.name}
                    </motion.h3>
                  </div>
                  
                  <motion.div 
                    animate={{ 
                        width: activeTab === plan.id ? '8rem' : '1.5rem',
                        opacity: activeTab === plan.id ? 1 : 0.1,
                        marginTop: activeTab === plan.id ? '2rem' : '1rem'
                    }}
                    className="h-2 bg-teal-500 dark:bg-[#64FFDA]" 
                  />
                </div>

                {/* Persistent Description - Always visible */}
                <div className="mb-8">
                  <motion.p 
                    animate={{ 
                      fontSize: activeTab === plan.id ? '1.25rem' : '0.875rem',
                      lineHeight: activeTab === plan.id ? '1.75rem' : '1.25rem',
                      opacity: activeTab === plan.id ? 0.8 : 0.25,
                      y: activeTab === plan.id ? 0 : 5
                    }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[#0A192F] dark:text-[#8892B0] max-w-lg font-sans will-change-[font-size,opacity,transform]"
                  >
                    {plan.description}
                  </motion.p>
                </div>

                {/* Features - ONLY visible when expanded */}
                <AnimatePresence>
                  {activeTab === plan.id && (
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
                      opacity: activeTab === plan.id ? 1 : 0.2,
                      scale: activeTab === plan.id ? 1 : 0.9
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
                  {activeTab === plan.id && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9, y: 30 }}
                      animate={{ opacity: 0.03, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 60, transition: { duration: 0.4 } }}
                      className="absolute bottom-[-10%] right-[-5%] text-[40rem] font-display font-bold text-[#0A192F] dark:text-[#F8F9FA] pointer-events-none uppercase select-none leading-none z-0"
                    >
                      {plan.name[0]}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
