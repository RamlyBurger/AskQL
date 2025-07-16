import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { initClientLogosScroll, initFallingStars } from '../utils/homeEffects';
import { Counter } from '../components/Counter';
import { Testimonials } from '../components/Testimonials';

const HomePage = () => {
    useEffect(() => {
        initClientLogosScroll();
        initFallingStars();
    }, []);

    return (
        <div className="bg-gray-50 dark:bg-gray-900">
            {/* Hero Section */}
            <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10"></div>
                <div className="container mx-auto px-6 py-24">
                    <div className="text-center" data-aos="fade-up">
                        <h1 className="text-6xl md:text-7xl font-bold mb-8 text-gray-900 dark:text-white">
                            <span className="text-blue-600 dark:text-blue-400">Transform</span> Your
                            <br />Database Experience
                        </h1>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
                            Intelligent database management and analysis platform powered by AI.
                            Visualize, analyze, and optimize your data like never before.
                        </p>
                        <Link 
                            to="/database"
                            className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold 
                                     hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition transform hover:scale-105"
                        >
                            Start Your Journey
                        </Link>
                    </div>
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                        <a href="#services" className="hero-scroll block">
                            <svg className="w-10 h-10 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Key Services Section */}
            <section id="services" className="py-24 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white" data-aos="fade-up">Key Services</h2>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-12">
                        {/* Database Management */}
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-700 shadow-lg transform hover:-translate-y-2 transition duration-300"
                             data-aos="fade-up" data-aos-delay="100">
                            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto xl:mx-0">
                                <i className="fas fa-database text-blue-600 dark:text-blue-400 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center xl:text-left">Smart Database Management</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center xl:text-left">Create and manage databases with ease. Import from CSV, connect to external sources, or build from scratch with AI-powered insights and optimization suggestions.</p>
                        </div>

                        {/* ERD Builder */}
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-700 shadow-lg transform hover:-translate-y-2 transition duration-300"
                             data-aos="fade-up" data-aos-delay="200">
                            <div className="bg-green-100 dark:bg-green-900/30 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto xl:mx-0">
                                <i className="fas fa-project-diagram text-green-600 dark:text-green-400 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center xl:text-left">Visual ERD Builder</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center xl:text-left">Design and visualize your database structure with our intuitive ERD builder. Create relationships and optimize your database architecture with smart suggestions.</p>
                        </div>

                        {/* AI Insights */}
                        <div className="p-8 rounded-2xl bg-white dark:bg-gray-700 shadow-lg transform hover:-translate-y-2 transition duration-300"
                             data-aos="fade-up" data-aos-delay="300">
                            <div className="bg-purple-100 dark:bg-purple-900/30 rounded-lg p-4 w-16 h-16 flex items-center justify-center mb-4 mx-auto xl:mx-0">
                                <i className="fas fa-brain text-purple-600 dark:text-purple-400 text-2xl"></i>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center xl:text-left">Advanced Analytics & AI Insights</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center xl:text-left">Get real-time data analysis with interactive visualizations and AI-powered insights to optimize your database performance.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="testimonials bg-gray-50 dark:bg-gray-900" id="testimonials">
                <Testimonials />
            </section>

            {/* Our Clients Section */}
            <section className="py-24 bg-white dark:bg-gray-800 overflow-hidden">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white" data-aos="fade-up">Our Clients</h2>
                    <div className="logo-rows space-y-16">
                        {/* First Row - Left to Right */}
                        <div className="logo-row flex space-x-8 animate-scroll-left">
                            <div className="logo-container min-w-[150px] h-[60px] bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <img src="https://static.vecteezy.com/system/resources/previews/013/901/773/original/facebook-icon-ios-facebook-social-media-logo-on-white-background-free-free-vector.jpg" alt="Company Name" className="w-32 h-auto" />
                            </div>
                        </div>
                        
                        {/* Second Row - Right to Left */}
                        <div className="logo-row flex space-x-8 animate-scroll-right">
                            <div className="logo-container min-w-[150px] h-[60px] bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <img src="https://static.vecteezy.com/system/resources/previews/013/901/773/original/facebook-icon-ios-facebook-social-media-logo-on-white-background-free-free-vector.jpg" alt="Company Name" className="w-32 h-auto" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24 bg-gray-50 dark:bg-gray-900" id="about">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* About Image */}
                        <div className="relative order-2 lg:order-1" data-aos="fade-right">
                            <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                                 alt="Our Team" 
                                 className="rounded-lg shadow-xl w-full" />
                            <div className="absolute -bottom-8 -right-8 bg-blue-600 dark:bg-blue-400 text-white p-8 rounded-full shadow-lg text-center w-36 h-36 flex flex-col justify-center items-center">
                                <div className="text-4xl font-bold">10</div>
                                <div className="text-sm leading-tight">Years of<br />Excellence</div>
                            </div>
                        </div>

                        {/* About Content */}
                        <div className="space-y-8 order-1 lg:order-2" data-aos="fade-left">
                            <div>
                                <h2 className="text-5xl font-bold text-gray-900 dark:text-white">
                                    About <span className="text-blue-600 dark:text-blue-400">AskQL</span>
                                </h2>
                            </div>

                            <p className="text-gray-600 dark:text-gray-300 text-lg">
                                Founded in 2015, AskQL has been revolutionizing database management through AI-powered solutions. 
                                Our innovative platform empowers developers and businesses to interact with their databases more 
                                intuitively, making complex data operations simple and efficient.
                            </p>

                            {/* Mission & Vision */}
                            <div className="grid lg:grid-cols-2 gap-8">
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-blue-600 dark:text-blue-400 mr-3"><i className="fas fa-bullseye"></i></span> Our Mission
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        To revolutionize database management by making it more accessible, intelligent, and 
                                        efficient through AI-powered solutions and intuitive interfaces.
                                    </p>
                                </div>

                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg space-y-4 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                                        <span className="text-blue-600 dark:text-blue-400 mr-3"><i className="fas fa-eye"></i></span> Our Vision
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        To be the global leader in intelligent database management solutions, setting new 
                                        standards for how businesses interact with and understand their data.
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-4 gap-6 pt-8">
                                <div className="text-center p-4">
                                    <Counter target={500} className="block text-4xl font-bold text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Projects<br />Completed</span>
                                </div>

                                <div className="text-center p-4">
                                    <Counter target={150} className="block text-4xl font-bold text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Happy<br />Clients</span>
                                </div>

                                <div className="text-center p-4">
                                    <Counter target={30} className="block text-4xl font-bold text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Team<br />Members</span>
                                </div>

                                <div className="text-center p-4">
                                    <Counter target={15} className="block text-4xl font-bold text-blue-600 dark:text-blue-400" />
                                    <span className="text-gray-600 dark:text-gray-400 text-sm">Countries<br />Served</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-white dark:bg-gray-800">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white" data-aos="fade-up">Ready to Get Started?</h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="100">
                        Join thousands of developers who are already using AskQL to manage their databases smarter.
                    </p>
                    <Link 
                        to="/database"
                        className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        data-aos="fade-up"
                        data-aos-delay="200"
                    >
                        Start Building Now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default HomePage; 