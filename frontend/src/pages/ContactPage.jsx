import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import './ContactPage.scss';

const ContactPage = () => {
    const ContactSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        message: Yup.string().required('Message is required'),
    });

    

    return (
        <div className="contact-page">
            <Helmet>
                <title>Contact Us - Trendy Edge</title>
                <meta name="description" content="Get in touch with the Trendy Edge team." />
            </Helmet>

            <h1>Contact Us</h1>
            <p>We'd love to hear from you! Feel free to reach out with any questions, comments, or feedback.</p>

            <Formik
                initialValues={{ name: '', email: '', message: '' }}
                validationSchema={ContactSchema}
                onSubmit={(values, { resetForm }) => {
                    console.log('Form Submitted:', values);
                    resetForm();
                    alert('Thank you for contacting us!');
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <div className="form-field">
                            <label htmlFor="name">Name</label>
                            <Field id="name" name="name" placeholder="Your Name" />
                            {errors.name && touched.name ? <div className="error">{errors.name}</div> : null}
                        </div>

                        <div className="form-field">
                            <label htmlFor="email">Email</label>
                            <Field id="email" name="email" type="email" placeholder="Your Email" />
                            {errors.email && touched.email ? <div className="error">{errors.email}</div> : null}
                        </div>

                        <div className="form-field">
                            <label htmlFor="message">Message</label>
                            <Field
                                id="message"
                                name="message"
                                as="textarea"
                                rows="5"
                                placeholder="Your Message"
                            />
                            {errors.message && touched.message ? <div className="error">{errors.message}</div> : null}
                        </div>

                        <button type="submit">Submit</button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};

export default ContactPage;
