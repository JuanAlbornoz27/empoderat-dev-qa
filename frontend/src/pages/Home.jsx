import React, { useEffect, useState } from 'react';
import Header from '../components/HeaderIndex';
import CourseCard from '../components/CourseCard';
import { courseService } from '../services/api';
import '../styles/Home.css';
import mottoImage from '../assets/motto-image.png';
import Footer from '../components/Footer';
import { mockCourses } from '../data/mockCourses';

const Home = () => {
  const [courses, setCourses] = useState([]);

  //const [courses, setCourses] = useState(mockCourses);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await courseService.getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);

    fetchCourses();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === Math.ceil(courses.length / 4) - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? Math.ceil(courses.length / 4) - 1 : prev - 1));
  };

  return (
    <div className="home-page">
      <Header isLoggedIn={isLoggedIn} />

      <main>
        <section id="courses" className="courses-section">
          <div className="section-header">
            <h2>Información sobre cursos y servicios</h2>
            <p>Te acompañamos en tu evolución</p>
          </div>

          <div className="courses-slider">
            <div className="slider-controls">
              <button className="slider-arrow prev" onClick={prevSlide}>&#8249;</button>
              <div className="courses-container">
                {courses.slice(currentSlide * 4, (currentSlide + 1) * 4).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <button className="slider-arrow next" onClick={nextSlide}>&#8250;</button>
            </div>
          </div>
          <section className="motto-section">
            <div className="motto-content">
              <div className="motto-text">
                <h2>Pequeños avances<br />grandes transformaciones</h2>
              </div>
              <div className="motto-image-container">
                <img
                  src={mottoImage}
                  alt="Transformación personal"
                  className="motto-image"
                />
              </div>
            </div>
          </section>
        </section>

        <section id="about" className="about-section">
          <h2 className="section-title">Sobre Nosotros</h2>
          <div className="about-container">
            <aside className="about-card">
              <h3>¿Por qué lo hacemos?</h3>
              <p>En EmpoderaTé, creemos en el poder transformador de la educación y el desarrollo personal. Nuestra misión es proporcionar herramientas y conocimientos que impulsen el crecimiento profesional y personal de las mujeres.</p>
              <ul className="about-list">
                <li>Promovemos la igualdad de oportunidades</li>
                <li>Desarrollamos habilidades de liderazgo</li>
                <li>Fomentamos el emprendimiento femenino</li>
                <li>Construimos una comunidad de apoyo</li>
              </ul>
            </aside>

            <aside className="about-card">
              <h3>¿Para quién va dirigido?</h3>
              <p>Nuestros programas están diseñados para mujeres que buscan:</p>
              <ul className="about-list">
                <li>Desarrollo profesional y personal</li>
                <li>Emprender sus propios negocios</li>
                <li>Fortalecer sus habilidades de liderazgo</li>
                <li>Conectar con una comunidad de mujeres emprendedoras</li>
              </ul>
            </aside>
          </div>
        </section>

        <section id="contact" className="contact-section">
          <h2 className="section-title">Contáctanos</h2>
          <div className="contact-container">
            <div className="contact-info">
              <h3>¿Tienes alguna pregunta?</h3>
              <p>Estamos aquí para ayudarte en tu proceso de crecimiento</p>
              <div className="contact-details">
                <p><i className="fas fa-envelope"></i> info@empoderate.com</p>
                <p><i className="fas fa-phone"></i> +57 300 123 4567</p>
                <p><i className="fas fa-map-marker-alt"></i> Tunja, Boyacá</p>
              </div>
            </div>
            <form className="contact-form">
              <div className="form-group">
                <input type="text" placeholder="Nombre completo" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Correo electrónico" required />
              </div>
              <div className="form-group">
                <textarea placeholder="Mensaje" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Enviar mensaje</button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Home;
