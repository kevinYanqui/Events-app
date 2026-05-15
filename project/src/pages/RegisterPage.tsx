import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Validación simple en el frontend
        if (formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden.');
            setIsLoading(false);
            return;
        }

        // Preparamos los datos para enviar al backend
        const { confirmPassword, ...payload } = formData;

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                // Si el backend devuelve un error (ej: email ya existe), lo mostramos
                const errorMessage = await response.text();
                throw new Error(errorMessage || 'Error al registrar la cuenta.');
            }

            toast.success('¡Registro exitoso! Ahora puedes iniciar sesión.');
            navigate('/login'); // Redirige al usuario a la página de login

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-blue-900">
                        Crear una cuenta
                    </h2>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-md">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input id="nombre" name="nombre" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
                            </div>
                            <div>
                                <label htmlFor="apellido" className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                                <input id="apellido" name="apellido" type="text" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input id="email" name="email" type="email" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
                        </div>

                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input id="telefono" name="telefono" type="tel" onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                            <input id="password" name="password" type="password" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500" />
                        </div>

                        <div>
                            <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-600 hover:bg-gold-700">
                                {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                            </button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Inicia sesión aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;