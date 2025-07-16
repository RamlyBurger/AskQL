import { useEffect, useRef, useState } from 'react';

interface TestimonialData {
    content: string;
    author: string;
    role: string;
    image: string;
}

const testimonials: TestimonialData[] = [
    {
        content: "Working with the ShopMe team has been a game-changer for our online presence. Their innovative approaches and dedication to excellence resulted in a 40% increase in our conversion rate.",
        author: "Sarah Johnson",
        role: "CEO, TechSolutions",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
        content: "The team's attention to detail and ability to understand our unique requirements set them apart from other agencies we've worked with. Our e-commerce platform has never performed better!",
        author: "David Chen",
        role: "CTO, RetailNova",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    },
    {
        content: "From the initial consultation to the final product launch, ShopMe exceeded our expectations at every turn. Their customer support is unmatched, and the solutions they delivered helped us scale our business rapidly.",
        author: "Michelle Torres",
        role: "Marketing Director, GrowthFusion",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80"
    }
];

export const Testimonials = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(0);
    const [currentTranslate, setCurrentTranslate] = useState(0);
    const [prevTranslate, setPrevTranslate] = useState(0);
    const [animationID, setAnimationID] = useState<number | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

    const moveToSlide = (index: number) => {
        setCurrentIndex(index);
        const translate = index * -(100 / testimonials.length);
        setCurrentTranslate(translate);
        setPrevTranslate(translate);
        if (trackRef.current) {
            trackRef.current.style.transform = `translateX(${translate}%)`;
        }
    };

    const moveToNextSlide = () => {
        if (currentIndex >= testimonials.length - 1) {
            moveToSlide(0);
        } else {
            moveToSlide(currentIndex + 1);
        }
    };

    const moveToPrevSlide = () => {
        if (currentIndex <= 0) {
            moveToSlide(testimonials.length - 1);
        } else {
            moveToSlide(currentIndex - 1);
        }
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayTimerRef.current = setInterval(moveToNextSlide, 5000);
    };

    const stopAutoplay = () => {
        if (autoplayTimerRef.current) {
            clearInterval(autoplayTimerRef.current);
            autoplayTimerRef.current = null;
        }
    };

    const getPositionX = (event: MouseEvent | TouchEvent) => {
        return event instanceof MouseEvent ? event.pageX : event.touches[0].clientX;
    };

    const touchStart = (event: React.MouseEvent | React.TouchEvent) => {
        stopAutoplay();
        setStartPos(getPositionX(event.nativeEvent));
        setIsDragging(true);
        if (trackRef.current) {
            trackRef.current.style.transition = 'none';
            trackRef.current.classList.add('cursor-grabbing');
        }
        const animId = requestAnimationFrame(animation);
        setAnimationID(animId);
    };

    const touchMove = (event: React.MouseEvent | React.TouchEvent) => {
        if (isDragging && trackRef.current) {
            const currentPosition = getPositionX(event.nativeEvent);
            const moveBy = (currentPosition - startPos) / trackRef.current.offsetWidth * 100;
            setCurrentTranslate(prevTranslate + moveBy);
            trackRef.current.style.transform = `translateX(${currentTranslate}%)`;
        }
    };

    const touchEnd = () => {
        setIsDragging(false);
        if (animationID !== null) {
            cancelAnimationFrame(animationID);
        }
        if (trackRef.current) {
            trackRef.current.classList.remove('cursor-grabbing');
            trackRef.current.style.transition = 'transform 0.3s ease-out';
        }

        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > 20) {
            if (movedBy < 0) {
                moveToNextSlide();
            } else {
                moveToPrevSlide();
            }
        } else {
            moveToSlide(currentIndex);
        }

        startAutoplay();
    };

    const animation = () => {
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    };

    useEffect(() => {
        startAutoplay();
        return () => stopAutoplay();
    }, []);

    return (
        <div className="container mx-auto px-6 py-20 select-none">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Client <span className="text-blue-600 dark:text-blue-500">Testimonials</span></h2>
                <p className="text-gray-600 dark:text-gray-400 mt-4">What our clients say about our services</p>
            </div>

            <div className="testimonial-container relative overflow-hidden max-w-4xl mx-auto">
                <button 
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center select-none border border-gray-200 dark:border-gray-600"
                    onClick={() => {
                        stopAutoplay();
                        moveToPrevSlide();
                        startAutoplay();
                    }}
                >
                    <i className="fas fa-chevron-left text-gray-600 dark:text-gray-300"></i>
                </button>

                <div 
                    ref={trackRef}
                    className="flex transition-transform duration-300 ease-out"
                    style={{ 
                        width: `${testimonials.length * 100}%`,
                        transform: `translateX(${currentTranslate}%)`,
                        cursor: isDragging ? 'grabbing' : 'grab'
                    }}
                    onMouseDown={touchStart}
                    onTouchStart={touchStart}
                    onMouseMove={touchMove}
                    onTouchMove={touchMove}
                    onMouseUp={touchEnd}
                    onTouchEnd={touchEnd}
                    onMouseLeave={touchEnd}
                >
                    {testimonials.map((testimonial, index) => (
                        <div 
                            key={index}
                            className="w-full flex-none"
                            style={{ width: `${100 / testimonials.length}%` }}
                        >
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-600 mx-4">
                                <div className="text-blue-600 dark:text-blue-500 text-5xl mb-6">
                                    <i className="fas fa-quote-left"></i>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">{testimonial.content}</p>
                                <div className="flex items-center">
                                    <img 
                                        src={testimonial.image} 
                                        alt={testimonial.author} 
                                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                                    />
                                    <div className="ml-4">
                                        <h4 className="text-gray-900 dark:text-white font-semibold">{testimonial.author}</h4>
                                        <p className="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <button 
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full shadow-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center select-none border border-gray-200 dark:border-gray-600"
                    onClick={() => {
                        stopAutoplay();
                        moveToNextSlide();
                        startAutoplay();
                    }}
                >
                    <i className="fas fa-chevron-right text-gray-600 dark:text-gray-300"></i>
                </button>

                <div className="flex justify-center mt-8 space-x-2">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`w-3 h-3 rounded-full cursor-pointer select-none ${
                                index === currentIndex 
                                    ? 'bg-blue-600 dark:bg-blue-500' 
                                    : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                            onClick={() => {
                                stopAutoplay();
                                moveToSlide(index);
                                startAutoplay();
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}; 