import React, { useState } from 'react';
import { Send, FileText, User, Mail, Phone, MapPin, School, BookOpen, CheckCircle, AlertCircle, Plus, Trash2, Edit3, Save } from 'lucide-react';

const IJSARTSubmissionForm = () => {
  const [formData, setFormData] = useState({
    // Paper Details
    title: '',
    abstract: '',
    keywords: '',
    researchArea: '',

    // Address
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',

    // Additional Details
    previousPublications: '',

    // Declarations
    originalWork: false,
    notPublishedElsewhere: false,
    copyrightTransfer: false,
    plagiarismResponsibility: false
  });

  const [authors, setAuthors] = useState([
    {
      id: 1,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      institute: '',
      department: '',
      designation: '',
      isPrimary: true
    }
  ]);

  const [editingAuthor, setEditingAuthor] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAuthorChange = (authorId, field, value) => {
    setAuthors(prev => prev.map(author =>
      author.id === authorId ? { ...author, [field]: value } : author
    ));
  };

  const addAuthor = () => {
    const newId = Math.max(...authors.map(a => a.id)) + 1;
    setAuthors(prev => [...prev, {
      id: newId,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      institute: '',
      department: '',
      designation: '',
      isPrimary: false
    }]);
  };

  const deleteAuthor = (authorId) => {
    if (authors.length > 1) {
      setAuthors(prev => prev.filter(author => author.id !== authorId));
    }
  };

  const startEditingAuthor = (authorId) => {
    setEditingAuthor(authorId);
  };

  const stopEditingAuthor = () => {
    setEditingAuthor(null);
  };

  const setPrimaryAuthor = (authorId) => {
    setAuthors(prev => prev.map(author => ({
      ...author,
      isPrimary: author.id === authorId
    })));
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const formatEmailContent = () => {
    const primaryAuthor = authors.find(a => a.isPrimary) || authors[0];
    const coAuthors = authors.filter(a => !a.isPrimary);

    const emailSubject = encodeURIComponent('New IJSART Journal Submission');

    const emailBody = encodeURIComponent(`
=== IJSART JOURNAL SUBMISSION ===

📄 PAPER INFORMATION:
Title: ${formData.title || 'Not provided'}
Abstract: ${formData.abstract || 'Not provided'}
Keywords: ${formData.keywords || 'Not provided'}
Research Area: ${formData.researchArea || 'Not specified'}

👤 PRIMARY AUTHOR:
Name: ${primaryAuthor.firstName} ${primaryAuthor.lastName}
Email: ${primaryAuthor.email || 'Not provided'}
Phone: ${primaryAuthor.phone || 'Not provided'}
Institute: ${primaryAuthor.institute || 'Not provided'}
Department: ${primaryAuthor.department || 'Not provided'}
Designation: ${primaryAuthor.designation || 'Not specified'}

${coAuthors.length > 0 ? `
👥 CO-AUTHORS:
${coAuthors.map((author, index) => `
${index + 1}. Name: ${author.firstName} ${author.lastName}
   Email: ${author.email || 'Not provided'}
   Phone: ${author.phone || 'Not provided'}
   Institute: ${author.institute || 'Not provided'}
   Department: ${author.department || 'Not provided'}
   Designation: ${author.designation || 'Not specified'}
`).join('')}` : ''}

📮 POSTAL ADDRESS:
Address: ${formData.address || 'Not provided'}
City: ${formData.city || 'Not provided'}
State: ${formData.state || 'Not provided'}
Country: ${formData.country || 'Not provided'}
PIN Code: ${formData.pincode || 'Not provided'}

📚 ADDITIONAL INFORMATION:
Previous Publications: ${formData.previousPublications || 'None mentioned'}

✅ DECLARATIONS:
${formData.originalWork ? '✓' : '✗'} Original Work Declaration
${formData.notPublishedElsewhere ? '✓' : '✗'} Not Published Elsewhere
${formData.copyrightTransfer ? '✓' : '✗'} Copyright Transfer Agreement
${formData.plagiarismResponsibility ? '✓' : '✗'} Plagiarism Responsibility

📅 Submission Date: ${new Date().toLocaleString()}

---
This submission was generated from the IJSART Online Submission Portal.
For queries, contact: editor.ijsart@gmail.com
Website: www.ijsart.com
    `);

    return `mailto:sanjay.n.ihub@snsgroups.com?subject=${emailSubject}&body=${emailBody}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const mailtoLink = formatEmailContent();
      window.location.href = mailtoLink;
      setSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { number: 1, title: 'Paper Details', icon: FileText },
    { number: 2, title: 'Authors', icon: User },
    { number: 3, title: 'Address', icon: MapPin },
    { number: 4, title: 'Declarations', icon: CheckCircle }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-pulse">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Submission Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your journal submission has been sent to our editorial team. You will receive a confirmation email shortly.
          </p>
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Next Steps:</strong><br />
              • Review & Feedback: 3-5 working days<br />
              • Acceptance Confirmation: Within 7 days<br />
              • Publication: 2-4 days after payment
            </p>
          </div>
          <button
            onClick={() => {
              setSubmitted(false);
              setCurrentStep(1);
              setFormData({
                title: '', abstract: '', keywords: '', researchArea: '',
                address: '', city: '', state: '', country: '', pincode: '',
                previousPublications: '', originalWork: false, notPublishedElsewhere: false,
                copyrightTransfer: false, plagiarismResponsibility: false
              });
              setAuthors([{
                id: 1, firstName: '', lastName: '', email: '', phone: '',
                institute: '', department: '', designation: '', isPrimary: true
              }]);
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
          >
            Submit Another Paper
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="w-12 h-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              IJSART Journal Submission
            </h1>
          </div>
          <p className="text-gray-600 text-lg">International Journal for Science and Advance Research In Technology</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <div key={step.number} className="flex items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted ? 'bg-green-500 text-white' :
                    isActive ? 'bg-indigo-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="ml-3 flex-1">
                    <p className={`font-medium ${isActive ? 'text-indigo-600' : 'text-gray-500'}`}>
                      Step {step.number}
                    </p>
                    <p className={`text-sm ${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                      {step.title}
                    </p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`h-1 w-full mx-4 rounded transition-all duration-300 ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            {/* Step 1: Paper Details */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-slide-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-indigo-600" />
                  Paper Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paper Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder="Enter your research paper title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abstract
                  </label>
                  <textarea
                    name="abstract"
                    value={formData.abstract}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder="Brief summary of your research paper..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keywords (4-5 keywords separated by commas)
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={formData.keywords}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder="machine learning, artificial intelligence, data science, neural networks"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Research Area
                  </label>
                  <select
                    name="researchArea"
                    value={formData.researchArea}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                  >
                    <option value="">Select Research Area</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Artificial Intelligence">Artificial Intelligence</option>
                    <option value="Machine Learning">Machine Learning</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Software Engineering">Software Engineering</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 2: Authors Management */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-slide-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <User className="w-6 h-6 mr-2 text-indigo-600" />
                    Authors Information
                  </h2>
                  <button
                    type="button"
                    onClick={addAuthor}
                    className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Author
                  </button>
                </div>

                <div className="space-y-6">
                  {authors.map((author, index) => (
                    <div key={author.id} className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                      author.isPrimary ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 bg-gray-50'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {author.isPrimary ? '👤 Primary Author' : `👥 Co-Author ${index}`}
                          </h3>
                          {!author.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryAuthor(author.id)}
                              className="ml-3 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full hover:bg-yellow-200 transition-colors"
                            >
                              Make Primary
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {editingAuthor === author.id ? (
                            <button
                              type="button"
                              onClick={stopEditingAuthor}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => startEditingAuthor(author.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {authors.length > 1 && (
                            <button
                              type="button"
                              onClick={() => deleteAuthor(author.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {(editingAuthor === author.id || !author.firstName) && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={author.firstName}
                              onChange={(e) => handleAuthorChange(author.id, 'firstName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              placeholder="Enter first name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={author.lastName}
                              onChange={(e) => handleAuthorChange(author.id, 'lastName', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              placeholder="Enter last name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Mail className="w-4 h-4 inline mr-1" />
                              Email Address
                            </label>
                            <input
                              type="email"
                              value={author.email}
                              onChange={(e) => handleAuthorChange(author.id, 'email', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              placeholder="author@example.com"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Phone className="w-4 h-4 inline mr-1" />
                              Phone Number
                            </label>
                            <input
                              type="tel"
                              value={author.phone}
                              onChange={(e) => handleAuthorChange(author.id, 'phone', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              placeholder="+91 9876543210"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <School className="w-4 h-4 inline mr-1" />
                              Institute/University Name
                            </label>
                            <input
                              type="text"
                              value={author.institute}
                              onChange={(e) => handleAuthorChange(author.id, 'institute', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              placeholder="Enter institute name"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Department
                            </label>
                            <input
                              type="text"
                              value={author.department}
                              onChange={(e) => handleAuthorChange(author.id, 'department', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                              placeholder="e.g., Computer Science, Mechanical Engineering"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Designation
                            </label>
                            <select
                              value={author.designation}
                              onChange={(e) => handleAuthorChange(author.id, 'designation', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                            >
                              <option value="">Select Designation</option>
                              <option value="Student">Student</option>
                              <option value="Research Scholar">Research Scholar</option>
                              <option value="Assistant Professor">Assistant Professor</option>
                              <option value="Associate Professor">Associate Professor</option>
                              <option value="Professor">Professor</option>
                              <option value="Industry Professional">Industry Professional</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      )}

                      {editingAuthor !== author.id && author.firstName && (
                        <div className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div><strong>Name:</strong> {author.firstName} {author.lastName}</div>
                            <div><strong>Email:</strong> {author.email || 'Not provided'}</div>
                            <div><strong>Phone:</strong> {author.phone || 'Not provided'}</div>
                            <div><strong>Institute:</strong> {author.institute || 'Not provided'}</div>
                            <div><strong>Department:</strong> {author.department || 'Not provided'}</div>
                            <div><strong>Designation:</strong> {author.designation || 'Not specified'}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-slide-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-6 h-6 mr-2 text-indigo-600" />
                  Postal Address
                </h2>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Address
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder="Enter your complete address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Enter state/province"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Enter country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN/ZIP Code
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                      placeholder="Enter PIN/ZIP code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Previous Publications
                  </label>
                  <textarea
                    name="previousPublications"
                    value={formData.previousPublications}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                    placeholder="List any previous publications (optional)"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Declarations */}
            {currentStep === 4 && (
              <div className="space-y-6 animate-slide-in">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <CheckCircle className="w-6 h-6 mr-2 text-indigo-600" />
                  Copyright Transfer & Declarations
                </h2>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Please read each declaration carefully and check the boxes to confirm your agreement.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="originalWork"
                        checked={formData.originalWork}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Original Work Declaration</p>
                        <p className="text-sm text-gray-600 mt-1">
                          I declare that the material being presented in this paper is my/our original work, and does not contain or include material taken from other copyrighted sources. Wherever such material has been included, it has been clearly indented and/or identified by quotation marks with proper acknowledgements.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="notPublishedElsewhere"
                        checked={formData.notPublishedElsewhere}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Publication Status Declaration</p>
                        <p className="text-sm text-gray-600 mt-1">
                          The paper, the final version of which I enclose, is not substantially the same as any that I/we have already published elsewhere. I/we have not sent the paper or any paper substantially the same as the enclosed one, for publication anywhere else.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="copyrightTransfer"
                        checked={formData.copyrightTransfer}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Copyright Transfer Agreement</p>
                        <p className="text-sm text-gray-600 mt-1">
                          I hereby transfer the Copyright of this paper to IJSART. I understand that the Editor-in-Chief may transfer the Copyright to a publisher at his discretion. The author(s) reserve(s) all proprietary rights such as patent rights and the right to use all or part of the article in future works.
                        </p>
                      </div>
                    </label>
                  </div>

                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="plagiarismResponsibility"
                        checked={formData.plagiarismResponsibility}
                        onChange={handleInputChange}
                        className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500"
                      />
                      <div>
                        <p className="font-medium text-gray-800">Plagiarism Responsibility</p>
                        <p className="text-sm text-gray-600 mt-1">
                          If any plagiarism is found in my camera-ready paper after publication, I am wholly responsible and not IJSART/IJSART members. The submitted paper is thoroughly proofread by me and in conformity with the instructions for authors.
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Submission Guidelines:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Ensure your paper follows IJSART format guidelines</li>
                    <li>• Review & feedback will be provided within 3-5 working days</li>
                    <li>• Acceptance confirmation within 7 days</li>
                    <li>• Publication within 2-4 days after payment confirmation</li>
                    <li>• Payment details will be shared upon acceptance</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  ← Previous Step
                </button>
              )}

              <div className="flex-1" />

              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Paper
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p className="flex items-center justify-center">
            <Mail className="w-4 h-4 mr-2" />
            Questions? Contact us at:
            <a href="mailto:editor.ijsart@gmail.com" className="text-indigo-600 hover:underline ml-1">
              editor.ijsart@gmail.com
            </a>
          </p>
          <p className="mt-2 text-sm">
            Visit: <a href="http://www.ijsart.com" className="text-indigo-600 hover:underline">www.ijsart.com</a> for more information
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }

        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .7; }
        }
      `}</style>
    </div>
  );
};

export default IJSARTSubmissionForm;
