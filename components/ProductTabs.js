'use client';

import { useState } from 'react';

export default function ProductTabs({ description, additionalInfo }) {
    const [ activeTab, setActiveTab ] = useState('desc');

    return (
        <div className="product-tabs mt-5">
            <ul className="nav nav-tabs border-bottom mb-4" role="tablist">
                <li className="nav-item">
                    <button
                        className={`nav-link text-uppercase fw-bold border-0 bg-transparent pb-3 ${activeTab === 'desc' ? 'active' : 'text-muted'}`}
                        onClick={() => setActiveTab('desc')}
                    >
                        Description
                    </button>
                </li>
                <li className="nav-item">
                    <button
                        className={`nav-link text-uppercase fw-bold border-0 bg-transparent pb-3 ${activeTab === 'specs' ? 'active' : 'text-muted'}`}
                        onClick={() => setActiveTab('specs')}
                    >
                        Specifications
                    </button>
                </li>
            </ul>
            <div className="tab-content py-3">
                {activeTab === 'desc' ? (
                    <div className="tab-pane fade show active">
                        <div className="row">
                            <div className="col-md-8">
                                <h4 className="mb-4">Product Story</h4>
                                <p className="text-secondary" style={{ lineHeight: '1.8' }}>
                                    {description || "Each Grahasthee product is crafted with attention to detail and traditional techniques, bringing home stories that last a lifetime."}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="tab-pane fade show active">
                        <div className="row">
                            <div className="col-md-8">
                                <h4 className="mb-4">Technical Details</h4>
                                <table className="table table-borderless">
                                    <tbody>
                                        {additionalInfo ? Object.entries(additionalInfo).map(([ key, value ]) => (
                                            <tr key={key} className="border-bottom">
                                                <th className="ps-0 py-3 text-uppercase small text-muted" scope="row" style={{ width: '200px' }}>{key.replace(/_/g, ' ')}</th>
                                                <td className="py-3">{value}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="2" className="text-muted">No specifications available.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
