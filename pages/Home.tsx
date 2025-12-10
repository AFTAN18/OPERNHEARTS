import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ArrowRight, Users, Heart, Target, Sparkles, HandHeart } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../config/motion';
import { Link } from 'react-router-dom';

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-slate-900/40 z-10" />
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Hero Background" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Hero Content */}
      <div className="container mx-auto px-4 z-20 text-center text-white relative">
        <motion.div
          initial="hidden"
          animate="show"
          variants={staggerContainer}
          className="max-w-4xl mx-auto space-y-6"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-4 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium text-primary-200">
            <span className="mr-2">✨</span> 2024 Impact Report Released
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Be the Change <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
               The World Needs
            </span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-lg md:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed">
            Join a global movement of volunteers and donors dedicated to creating sustainable change in underserved communities.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link to="/volunteer">
                <Button size="lg" variant="primary" className="w-full sm:w-auto font-bold text-white">
                    Become a Volunteer <ArrowRight size={20} />
                </Button>
            </Link>
            <Link to="/donate">
                <Button size="lg" variant="accent" className="w-full sm:w-auto font-bold text-white">
                    Donate Now <Heart size={20} className="text-white fill-white/20" />
                </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Decorative Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-30 translate-y-1">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0L48 8.8C96 17.7 192 35.3 288 42.3C384 49.3 480 45.7 576 38.7C672 31.7 768 21.3 864 24.8C960 28.3 1056 45.7 1152 52.7C1248 59.7 1344 56.3 1392 54.7L1440 53V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" fill="#f8fafc"/>
        </svg>
      </div>
    </div>
  );
};

const StatsSection = () => {
  const stats = [
    { label: 'Lives Impacted', value: '2.5M+', icon: Users, color: 'text-blue-500' },
    { label: 'Volunteers', value: '15k+', icon: HandHeart, color: 'text-primary-500' },
    { label: 'Campaigns', value: '120+', icon: Target, color: 'text-accent-500' },
  ];

  return (
    <section className="py-24 bg-slate-50 relative">
      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="text-center h-full flex flex-col items-center justify-center p-8 group">
                <div className={`p-4 rounded-full bg-slate-50 mb-4 group-hover:scale-110 transition-transform ${stat.color} bg-opacity-10`}>
                  <stat.icon size={32} className={stat.color} />
                </div>
                <h3 className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</h3>
                <p className="text-slate-500 font-medium">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Carousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Dummy stories
  const stories = Array.from({ length: 5 }).map((_, i) => ({
    id: i,
    name: `Volunteer Story ${i + 1}`,
    image: `https://picsum.photos/400/500?random=${i + 10}`,
    quote: "Volunteering changed my perspective on life completely. It's not just about giving, it's about growing together."
  }));

  return (
    <section className="py-24 overflow-hidden bg-white">
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-3xl font-bold mb-4">Voices of Change</h2>
        <div className="w-20 h-1 bg-primary-500 rounded-full" />
      </div>

      <motion.div 
        className="flex gap-6 px-4 md:px-8 overflow-x-auto no-scrollbar pb-12"
        ref={scrollRef}
        drag="x"
        dragConstraints={{ right: 0, left: -1000 }}
      >
        {stories.map((story) => (
          <motion.div 
            key={story.id} 
            className="min-w-[300px] md:min-w-[400px] relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-grab active:cursor-grabbing"
            whileHover={{ scale: 1.02 }}
          >
            <img src={story.image} alt={story.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-8 flex flex-col justify-end">
                <Sparkles className="text-accent-400 mb-2" />
                <p className="text-white text-lg font-medium italic mb-4">"{story.quote}"</p>
                <p className="text-primary-400 font-bold">{story.name}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

const Home = () => {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Hero />
      <StatsSection />
      <div className="container mx-auto px-4 py-20 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
            <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
            >
                <div className="absolute -inset-4 bg-accent-200 rounded-full blur-3xl opacity-30 animate-pulse" />
                <img src="https://picsum.photos/600/600?random=1" alt="Our Mission" className="relative rounded-2xl shadow-2xl z-10" />
                <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-xl shadow-xl z-20 max-w-xs hidden md:block">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-ping" />
                        <span className="font-bold text-slate-800">Live Mission</span>
                    </div>
                    <p className="text-sm text-slate-600">Clean water project in East Africa currently active.</p>
                </div>
            </motion.div>
        </div>
        <div className="md:w-1/2 space-y-6">
            <h2 className="text-4xl font-bold text-slate-900">Empowering Local Communities</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
                We believe that sustainable change starts from within. By providing resources, education, and platform, we enable local leaders to solve local problems.
            </p>
            <ul className="space-y-4">
                {['Direct funding to ground partners', 'Transparent supply chains', 'Real-time impact tracking'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">✓</div>
                        {item}
                    </li>
                ))}
            </ul>
            <Link to="/campaigns" className='inline-block'>
                <Button variant="outline">Learn More</Button>
            </Link>
        </div>
      </div>
      <Carousel />
    </div>
  );
};

export default Home;