'use client';

import { useState } from 'react';

export default function ProductTabs({ description, additionalInfo, faq, reviews }) {
    // Filter available tabs based on data
    const availableTabs = [
        { id: 'specs', label: 'Specifications', show: additionalInfo && Object.keys(additionalInfo).length > 0 },
        { id: 'faq', label: 'FAQ', show: faq && faq.length > 0 },
        { id: 'reviews', label: `Reviews (${reviews?.length || 0})`, show: reviews && reviews.length > 0 }
    ].filter(tab => tab.show);

    const [ activeTab, setActiveTab ] = useState(availableTabs[ 0 ]?.id || 'specs');
    const [ openFaq, setOpenFaq ] = useState(null);

    if (availableTabs.length === 0) return null;

    // Ensure active tab is still valid after filtering
    const currentActiveTab = availableTabs.find(t => t.id === activeTab) ? activeTab : availableTabs[ 0 ]?.id;

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    return (
        <div className="product-tabs mt-5">
            <ul className="nav nav-tabs border-0 border-bottom mb-4 d-flex flex-nowrap overflow-auto" role="tablist">
                {availableTabs.map((tab) => (
                    <li className="nav-item" key={tab.id} role="presentation">
                        <button
                            className={`nav-link text-uppercase fw-bold border-0 bg-transparent pb-3 pt-0 me-4 px-0 position-relative ${currentActiveTab === tab.id ? 'active text-dark' : 'text-muted'}`}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                color: currentActiveTab === tab.id ? '#000' : '#888',
                                fontSize: '0.9rem',
                                letterSpacing: '1px',
                                borderBottom: currentActiveTab === tab.id ? '2px solid #000' : 'none',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {tab.label}
                        </button>
                    </li>
                ))}
            </ul>

            <div className="tab-content py-4">
                {/* Specifications Tab */}
                {currentActiveTab === 'specs' && (
                    <div className="tab-pane fade show active">
                        <div className="row">
                            <div className="col-md-8">
                                <h4 className="mb-4 text-uppercase fw-bold" style={{ fontSize: '1.2rem' }}>Technical Details</h4>
                                <table className="table table-borderless">
                                    <tbody>
                                        {Object.entries(additionalInfo).map(([ key, value ]) => (
                                            <tr key={key} className="border-bottom">
                                                <th className="ps-0 py-3 text-uppercase small text-muted" scope="row" style={{ width: '200px', fontWeight: '500' }}>{key.replace(/_/g, ' ')}</th>
                                                <td className="py-3 text-dark">{value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ Tab */}
                {currentActiveTab === 'faq' && (
                    <div className="tab-pane fade show active">
                        <div className="row">
                            <div className="col-md-8">
                                <h4 className="mb-4 text-uppercase fw-bold" style={{ fontSize: '1.2rem' }}>Frequently Asked Questions</h4>
                                <div className="accordion accordion-flush" id="faqAccordion">
                                    {faq.map((item, index) => (
                                        <div className="accordion-item border-bottom py-2" key={index} style={{ backgroundColor: 'transparent' }}>
                                            <h2 className="accordion-header">
                                                <button
                                                    className={`accordion-button ${openFaq === index ? '' : 'collapsed'} px-0 bg-transparent fw-bold shadow-none`}
                                                    type="button"
                                                    onClick={() => toggleFaq(index)}
                                                    aria-expanded={openFaq === index}
                                                    style={{ border: 'none', color: '#333' }}
                                                >
                                                    {item.question}
                                                </button>
                                            </h2>
                                            <div
                                                className={`accordion-collapse collapse ${openFaq === index ? 'show' : ''}`}
                                            >
                                                <div className="accordion-body px-0 text-secondary">
                                                    {item.answer}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Reviews Tab */}
                {currentActiveTab === 'reviews' && (
                    <div className="tab-pane fade show active">
                        <div className="row">
                            <div className="col-md-10">
                                <div className="d-flex align-items-center justify-content-between mb-5">
                                    <h4 className="text-uppercase fw-bold m-0" style={{ fontSize: '1.2rem' }}>Customer Reviews</h4>
                                </div>

                                {reviews && reviews.length > 0 ? (
                                    <div className="review-list">
                                        {reviews.map((review) => (
                                            <div className="review-item border-bottom pb-4 mb-4" key={review.id}>
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="mb-1 fw-bold">{review.user_name}</h6>
                                                        <div className="stars d-flex text-warning mb-2" style={{ fontSize: '0.8rem' }}>
                                                            {[ ...Array(5) ].map((_, i) => (
                                                                <svg key={i} width="14" height="14" viewBox="0 0 15 15" className="me-1">
                                                                    <use xlinkHref={i < review.rating ? "#star-solid" : "#star-outline"}></use>
                                                                </svg>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                                                </div>
                                                <p className="mb-0 text-secondary" style={{ lineHeight: '1.6' }}>{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-5 bg-light">
                                        <p className="text-muted mb-0">No reviews yet. Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
