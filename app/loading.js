export default function Loading() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-white">
            <div className="text-center">
                <div className="spinner-border text-dark mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h5 className="text-uppercase fw-bold letter-spacing-1">Grahasthee</h5>
            </div>
        </div>
    );
}
