'use client';

import React, { useState, useEffect } from 'react';
import { Bed, Bath, Maximize, MapPin, Phone, Mail, Building2, X, Upload, Edit2, Save, LogOut, LogIn } from 'lucide-react';

// Default property data
const defaultPropertyData = {
  address: "Oude Brugsepoort 59, 9800 Deinze, Oost-Vlaanderen, België",
  monthlyRent: "€ 950",
  bedrooms: 2,
  bathrooms: 1,
  livingArea: 115,
  totalArea: 222,
  availableFrom: "Onmiddellijk beschikbaar",
  propertyType: "Halfopen bebouwing",
  features: [
    "Parking beschikbaar",
    "Garage",
    "Makkelijk te onderhouden tuin",
    "Op wandelafstand van Deinze centrum",
    "Dubbele beglazing",
    "Goed geïsoleerde woning",
    "Mogelijkheid voor 3e slaapkamer op zolder",
    "Gevelbreedte 4.90 m",
    "Oriëntatie tuin: Noord-Oost"
  ],
  description: "Charmante halfopen woning gelegen in een rustige buurt op wandelafstand van het centrum van Deinze. De woning beschikt over 2 ruime slaapkamers met de mogelijkheid om de zolder om te bouwen tot een derde slaapkamer. Met een bewoonbare oppervlakte van 115 m² en een totale oppervlakte van 222 m² biedt deze woning alle comfort die u nodig heeft. De woning is voorzien van dubbele beglazing en is goed geïsoleerd, wat zorgt voor een laag energieverbruik.",
  phone: "0486/30.22.20",
  email: "eddy9800@gmail.com",
  mapUrl: "https://www.google.com/maps/place/Oude+Brugsepoort+59,+9800+Deinze/@50.98922,3.5205228,17z/data=!4m6!3m5!1s0x47c36b6560123b8d:0x8d461276b5c0a363!8m2!3d50.9893531!4d3.5205152!16s%2Fg%2F11csdgq__j?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D",
  images: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800"
  ]
};

const ADMIN_PASSWORD = "77wx58L#iBnp";

export default function RentalPropertyWebsite() {
  const [propertyData, setPropertyData] = useState(defaultPropertyData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(defaultPropertyData);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('propertyData');
    if (saved) {
      setPropertyData(JSON.parse(saved));
    }
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
    } else {
      alert('Incorrect wachtwoord');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setEditMode(false);
  };

  const startEdit = () => {
    setEditData({ ...propertyData });
    setEditMode(true);
  };

  const saveChanges = () => {
    setPropertyData(editData);
    localStorage.setItem('propertyData', JSON.stringify(editData));
    setEditMode(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditData({
          ...editData,
          images: [...editData.images, reader.result as string]
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setEditData({
      ...editData,
      images: editData.images.filter((_, i) => i !== index)
    });
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setEditData({
        ...editData,
        features: [...editData.features, newFeature.trim()]
      });
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    setEditData({
      ...editData,
      features: editData.features.filter((_, i) => i !== index)
    });
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Login</h2>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              placeholder="Wachtwoord"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Inloggen
            </button>
            <button
              onClick={() => setShowLogin(false)}
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Annuleren
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Woning Bewerken</h2>
            <div className="space-x-2">
              <button
                onClick={saveChanges}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition inline-flex items-center gap-2"
              >
                <Save size={18} /> Opslaan
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Annuleren
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Maandelijkse Huurprijs</label>
              <input
                type="text"
                value={editData.monthlyRent}
                onChange={(e) => setEditData({ ...editData, monthlyRent: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Beschikbaar vanaf</label>
              <input
                type="text"
                value={editData.availableFrom}
                onChange={(e) => setEditData({ ...editData, availableFrom: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Beschrijving</label>
              <textarea
                value={editData.description}
                onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Slaapkamers</label>
                <input
                  type="number"
                  value={editData.bedrooms}
                  onChange={(e) => setEditData({ ...editData, bedrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Badkamers</label>
                <input
                  type="number"
                  value={editData.bathrooms}
                  onChange={(e) => setEditData({ ...editData, bathrooms: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Kenmerken</label>
              <div className="space-y-2 mb-3">
                {editData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                    <span className="flex-1">{feature}</span>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nieuw kenmerk toevoegen"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <button
                  onClick={addFeature}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Toevoegen
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Foto&apos;s</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {editData.images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Foto ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <label className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2">
                <Upload size={18} /> Foto Uploaden
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Button */}
      {!isAdmin && (
        <button
          onClick={() => setShowLogin(true)}
          className="fixed top-4 right-4 bg-gray-800 text-white p-3 rounded-full shadow-lg hover:bg-gray-700 transition z-50"
        >
          <LogIn size={20} />
        </button>
      )}

      {isAdmin && (
        <div className="fixed top-4 right-4 flex gap-2 z-50">
          <button
            onClick={startEdit}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            <Edit2 size={18} /> Bewerken
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition inline-flex items-center gap-2"
          >
            <LogOut size={18} /> Uitloggen
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative h-[500px] bg-gray-900">
        <img
          src={propertyData.images[0]}
          alt="Hoofdfoto woning"
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="max-w-6xl mx-auto w-full px-4 pb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Te Huur</h1>
            <p className="text-xl text-white flex items-center gap-2">
              <MapPin size={24} />
              {propertyData.address}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Price and Key Info */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h2 className="text-4xl font-bold text-blue-600 mb-2">{propertyData.monthlyRent}</h2>
              <p className="text-gray-600">per maand</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-semibold">
                {propertyData.availableFrom}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <Bed className="text-blue-600" size={28} />
              <div>
                <p className="text-2xl font-bold">{propertyData.bedrooms}</p>
                <p className="text-gray-600 text-sm">Slaapkamers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Bath className="text-blue-600" size={28} />
              <div>
                <p className="text-2xl font-bold">{propertyData.bathrooms}</p>
                <p className="text-gray-600 text-sm">Badkamers</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Maximize className="text-blue-600" size={28} />
              <div>
                <p className="text-2xl font-bold">{propertyData.livingArea}m²</p>
                <p className="text-gray-600 text-sm">Bewoonbaar</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Building2 className="text-blue-600" size={28} />
              <div>
                <p className="text-2xl font-bold">{propertyData.totalArea}m²</p>
                <p className="text-gray-600 text-sm">Totaal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Beschrijving</h3>
          <p className="text-gray-700 leading-relaxed">{propertyData.description}</p>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Kenmerken</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {propertyData.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <p className="text-gray-700">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Photo Gallery */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Foto&apos;s</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {propertyData.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Foto ${index + 1}`}
                className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Locatie</h3>
          <a
            href={propertyData.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-blue-50 border-2 border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" size={32} />
                <div>
                  <p className="font-semibold text-gray-800">{propertyData.address}</p>
                  <p className="text-blue-600">Bekijk op Google Maps →</p>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Contact */}
        <div className="bg-blue-600 rounded-lg shadow-lg p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Interesse? Neem contact op!</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <a href={`tel:${propertyData.phone}`} className="flex items-center gap-4 bg-blue-700 p-4 rounded-lg hover:bg-blue-800 transition">
              <Phone size={28} />
              <div>
                <p className="text-sm opacity-90">Bel ons</p>
                <p className="text-xl font-semibold">{propertyData.phone}</p>
              </div>
            </a>
            <a href={`mailto:${propertyData.email}`} className="flex items-center gap-4 bg-blue-700 p-4 rounded-lg hover:bg-blue-800 transition">
              <Mail size={28} />
              <div>
                <p className="text-sm opacity-90">Email ons</p>
                <p className="text-xl font-semibold">{propertyData.email}</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70"
            onClick={() => setSelectedImage(null)}
          >
            <X size={24} />
          </button>
          <img
            src={selectedImage}
            alt="Vergrote foto"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
}
