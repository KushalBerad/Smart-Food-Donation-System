export default function StatsCard({ icon: Icon, number, label }) {
    return (
        <div className="stat-card">
            <div className="stat-icon">
                <Icon size={20} />
            </div>
            <div className="stat-info">
                <span className="stat-number">{number}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}
