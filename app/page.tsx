'use client';

import React, { useState, useEffect } from 'react';
import { Bed, Bath, Maximize, MapPin, Phone, Mail, Building2, X, Upload, Edit2, Save, LogOut, LogIn, ChevronLeft, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';

interface PropertyImage {
  url: string;
  caption: string;
}

interface PropertyDocument {
  url: string;
  name: string;
}

interface PropertyData {
  address: string;
  monthlyRent: string;
  bedrooms: number;
  bathrooms: number;
  livingArea: number;
  totalArea: number;
  availableFrom: string;
  propertyType: string;
  features: string[];
  description: string;
  phone: string;
  email: string;
  mapUrl: string;
  images: PropertyImage[];
  documents: PropertyDocument[];
}

const defaultPropertyData: PropertyData = {
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
  description: "✨ Charmante halfopen woning nabij het hart van Deinze ✨\n\nOntdek deze gezellige en lichtrijke woning, ideaal gelegen in een rustige buurt op wandelafstand van het bruisende centrum van Deinze. Hier geniet je van de perfecte balans tussen sereniteit en stadscomfort.\n\n🛏️ 2 ruime slaapkamers met de mogelijkheid om de zolder eenvoudig om te vormen tot een derde kamer – ideaal voor een groeiend gezin of een thuiskantoor.\n\n📐 115 m² bewoonbare oppervlakte op een perceel van 222 m², waardoor je zowel binnen als buiten alle ruimte hebt om te leven en te genieten.\n\n🌿 Energiezuinig wonen dankzij dubbele beglazing en een degelijke isolatie, wat niet alleen comfort maar ook een lage energiefactuur garandeert.\n\nDeze woning combineert charme, functionaliteit en toekomstmogelijkheden. Een unieke kans voor wie op zoek is naar een warme thuis in een aantrekkelijke omgeving.",
  phone: "0486/30.22.20",
  email: "eddy9800@gmail.com",
  mapUrl: "https://www.google.com/maps/place/Oude+Brugsepoort+59,+9800+Deinze/@50.98922,3.5205228,17z/data=!4m6!3m5!1s0x47c36b6560123b8d:0x8d461276b5c0a363!8m2!3d50.9893531!4d3.5205152!16s%2Fg%2F11csdgq__j?entry=ttu&g_ep=EgoyMDI1MTIwMi4wIKXMDSoASAFQAw%3D%3D",
  images: [
    { url: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", caption: "Voorgevel" },
    { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", caption: "Woonkamer" },
    { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800", caption: "Keuken" },
    { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", caption: "Slaapkamer" }
  ],
  documents: []
};

const ADMIN_PASSWORD = "77wx58L#iBnp";
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function RentalPropertyWebsite() {
  const [propertyData, setPropertyData] = useState<PropertyData>(defaultPropertyData);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<PropertyData>(defaultPropertyData);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [newFeature, setNewFeature] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('propertyData');
    if (saved) {
      const parsedData = JSON.parse(saved);
      // Migrate old format to new format with captions
      if (parsedData.images && parsedData.images.length > 0 && typeof parsedData.images[0] === 'string') {
        parsedData.images = parsedData.images.map((url: string, index: number) => ({
          url,
          caption: `Foto ${index + 1}`
        }));
      }
      // Ensure documents array exists
      if (!parsedData.documents) {
        parsedData.documents = [];
      }
      setPropertyData(parsedData);
    }

    // Load Cloudinary widget script
    const script = document.createElement('script');
    script.src = 'https://upload-widget.cloudinary.com/global/all.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
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

  const openCloudinaryWidget = () => {
    console.log('Cloudinary Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('Cloudinary Upload Preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('Window.cloudinary exists:', typeof window.cloudinary !== 'undefined');
    
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert(`Cloudinary niet geconfigureerd!\nCloud Name: ${CLOUDINARY_CLOUD_NAME || 'ONTBREEKT'}\nUpload Preset: ${CLOUDINARY_UPLOAD_PRESET || 'ONTBREEKT'}\n\nVoeg environment variables toe in Vercel en redeploy.`);
      return;
    }

    if (typeof window.cloudinary === 'undefined') {
      alert('Cloudinary widget is nog aan het laden. Wacht 10 seconden en probeer opnieuw.');
      return;
    }

    setUploading(true);
    
    try {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: CLOUDINARY_CLOUD_NAME,
          uploadPreset: CLOUDINARY_UPLOAD_PRESET,
          sources: ['local', 'camera'],
          multiple: false,
          maxFiles: 1,
          clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
          maxFileSize: 5000000,
          folder: 'rental-property'
        },
        (error: any, result: any) => {
          if (error) {
            console.error('Upload error:', error);
            alert('Upload mislukt: ' + (error.statusText || 'Onbekende fout'));
            setUploading(false);
            return;
          }
          
          if (result.event === 'success') {
            console.log('Upload success:', result.info);
            const imageUrl = result.info.secure_url;
            setEditData({
              ...editData,
              images: [...editData.images, { url: imageUrl, caption: 'Nieuwe foto' }]
            });
            setUploading(false);
          } else if (result.event === 'close') {
            setUploading(false);
          }
        }
      );

      console.log('Opening widget...');
      widget.open();
    } catch (err) {
      console.error('Widget creation error:', err);
      alert('Fout bij openen widget: ' + err);
      setUploading(false);
    }
  };

  const openDocumentWidget = () => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      alert('Cloudinary is niet correct geconfigureerd. Voeg de environment variables toe in Vercel.');
      return;
    }

    if (typeof window.cloudinary === 'undefined') {
      alert('Cloudinary widget is nog aan het laden. Probeer het opnieuw.');
      return;
    }

    setUploadingDoc(true);
    
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local'],
        multiple: false,
        maxFiles: 1,
        clientAllowedFormats: ['pdf'],
        maxFileSize: 10000000,
        folder: 'rental-property/documents'
      },
      (error: any, result: any) => {
        setUploadingDoc(false);
        if (error) {
          console.error('Upload error:', error);
          alert('Upload mislukt. Probeer het opnieuw.');
          return;
        }
        
        if (result.event === 'success') {
          const docUrl = result.info.secure_url;
          const docName = result.info.original_filename || 'Document';
          setEditData({
            ...editData,
            documents: [...editData.documents, { url: docUrl, name: docName }]
          });
        }
      }
    );

    widget.open();
  };

  const removeImage = (index: number) => {
    setEditData({
      ...editData,
      images: editData.images.filter((_, i) => i !== index)
    });
  };

  const moveImageUp = (index: number) => {
    if (index === 0) return;
    const newImages = [...editData.images];
    [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
    setEditData({ ...editData, images: newImages });
  };

  const moveImageDown = (index: number) => {
    if (index === editData.images.length - 1) return;
    const newImages = [...editData.images];
    [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
    setEditData({ ...editData, images: newImages });
  };

  const updateImageCaption = (index: number, caption: string) => {
    const newImages = [...editData.images];
    newImages[index] = { ...newImages[index], caption };
    setEditData({ ...editData, images: newImages });
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

  const removeDocument = (index: number) => {
    setEditData({
      ...editData,
      documents: editData.documents.filter((_, i) => i !== index)
    });
  };

  const updateDocumentName = (index: number, name: string) => {
    const newDocs = [...editData.documents];
    newDocs[index] = { ...newDocs[index], name };
    setEditData({ ...editData, documents: newDocs });
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeImageViewer = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const goToNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < propertyData.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
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
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg font-mono text-sm"
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
              <label className="block text-sm font-semibold mb-2">Foto&apos;s (eerste foto = hoofdfoto homepage)</label>
              <div className="space-y-3 mb-4">
                {editData.images.map((img, index) => (
                  <div key={index} className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg">
                    <img src={img.url} alt={img.caption} className="w-24 h-24 object-cover rounded" />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) => updateImageCaption(index, e.target.value)}
                        placeholder="Onderschrift (bv. Badkamer, Slaapkamer 1)"
                        className="w-full px-3 py-2 border border-gray-300 rounded mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => moveImageUp(index)}
                          disabled={index === 0}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                        >
                          <ArrowUp size={16} /> Omhoog
                        </button>
                        <button
                          onClick={() => moveImageDown(index)}
                          disabled={index === editData.images.length - 1}
                          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                        >
                          <ArrowDown size={16} /> Omlaag
                        </button>
                        <button
                          onClick={() => removeImage(index)}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 inline-flex items-center gap-1"
                        >
                          <X size={16} /> Verwijder
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  console.log('FOTO UPLOAD BUTTON CLICKED!');
                  openCloudinaryWidget();
                }}
                disabled={uploading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={18} /> {uploading ? 'Uploaden...' : 'Foto Uploaden'}
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Documenten (PDFs)</label>
              <div className="space-y-2 mb-3">
                {editData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 bg-gray-50 p-3 rounded">
                    <input
                      type="text"
                      value={doc.name}
                      onChange={(e) => updateDocumentName(index, e.target.value)}
                      placeholder="Document naam"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded"
                    />
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                    >
                      Bekijk
                    </a>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  console.log('PDF UPLOAD BUTTON CLICKED!');
                  openDocumentWidget();
                }}
                disabled={uploadingDoc}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 cursor-pointer inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload size={18} /> {uploadingDoc ? 'Uploaden...' : 'PDF Uploaden'}
              </button>
              <p className="text-sm text-gray-500 mt-2">
                Upload documenten zoals energiecertificaat, grondplan, huurcontract, etc.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="relative h-[500px] bg-gray-900">
        <img
          src={propertyData.images[0]?.url}
          alt={propertyData.images[0]?.caption || "Hoofdfoto woning"}
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

      <div className="max-w-6xl mx-auto px-4 py-12">
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

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">Beschrijving</h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">{propertyData.description}</div>
        </div>

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

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h3 className="text-2xl font-bold mb-6 text-gray-800">Foto&apos;s</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {propertyData.images.map((img, index) => (
              <div key={index} className="relative group cursor-pointer" onClick={() => openImageViewer(index)}>
                <img
                  src={img.url}
                  alt={img.caption}
                  className="w-full h-64 object-cover rounded-lg hover:opacity-90 transition"
                />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-4 py-2 rounded-b-lg">
                    <p className="text-sm font-medium">{img.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {propertyData.documents && propertyData.documents.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Documenten</h3>
            <div className="space-y-3">
              {propertyData.documents.map((doc, index) => (
                <a
                  key={index}
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold text-sm">PDF</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 group-hover:text-blue-600">{doc.name}</p>
                      <p className="text-sm text-gray-500">Klik om te openen</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 group-hover:text-blue-600" size={24} />
                </a>
              ))}
            </div>
          </div>
        )}

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

      {selectedImageIndex !== null && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeImageViewer}
        >
          <button
            className="absolute top-4 right-4 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 z-10"
            onClick={closeImageViewer}
          >
            <X size={24} />
          </button>

          {selectedImageIndex > 0 && (
            <button
              className="absolute left-4 text-white bg-black/50 p-3 rounded-full hover:bg-black/70 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {selectedImageIndex < propertyData.images.length - 1 && (
            <button
              className="absolute right-4 text-white bg-black/50 p-3 rounded-full hover:bg-black/70 z-10"
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
            >
              <ChevronRight size={32} />
            </button>
          )}

          <div className="max-w-7xl max-h-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={propertyData.images[selectedImageIndex].url}
              alt={propertyData.images[selectedImageIndex].caption}
              className="max-w-full max-h-[85vh] object-contain"
            />
            {propertyData.images[selectedImageIndex].caption && (
              <div className="mt-4 bg-black/70 text-white px-6 py-3 rounded-lg">
                <p className="text-lg font-medium">{propertyData.images[selectedImageIndex].caption}</p>
                <p className="text-sm text-gray-300 mt-1">
                  {selectedImageIndex + 1} / {propertyData.images.length}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
