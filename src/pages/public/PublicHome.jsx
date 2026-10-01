import { Link } from 'react-router-dom';
import { useStore } from '../../hooks/useStore';

export default function PublicHome() {
  const { state } = useStore();

  // Find images by slot (primary), fallback to name matching
  const heroImg = state.images.find((i) => i.slot === 'hero') || state.images.find((i) => i.name.toLowerCase().includes('hero'));
  const projectImg = state.images.find((i) => i.slot === 'project') || state.images.find((i) => i.name.toLowerCase().includes('project'));
  const galleryImgs = state.images.filter((i) => i.slot === 'gallery' || i.slot === 'amenities' || i.slot === 'location');
  const floorplanImg = state.images.find((i) => i.slot === 'floorplan') || state.images.find((i) => i.name.toLowerCase().includes('floor'));
  const amenitiesImg = state.images.find((i) => i.slot === 'amenities');
  const locationImg = state.images.find((i) => i.slot === 'location');

  // All gallery-eligible images (including floorplan if present)
  const allGallery = [];
  if (projectImg?.url) allGallery.push(projectImg);
  galleryImgs.forEach((img) => {
    if (img.url && !allGallery.find((g) => g.id === img.id)) allGallery.push(img);
  });
  if (floorplanImg?.url && !allGallery.find((g) => g.id === floorplanImg.id)) allGallery.push(floorplanImg);

  const firstLink = state.links.length > 0 ? state.links[0] : null;

  return (
    <div>
      {/* ─── Hero Section ─── */}
      <section className="hero">
        {heroImg?.url ? (
          <div className="hero-bg">
            <img src={heroImg.url} alt={heroImg.alt || 'Property hero'} />
          </div>
        ) : (
          <div className="hero-placeholder-bg" />
        )}
        <div className="hero-content">
          <div className="hero-eyebrow">Premium Real Estate</div>
          <h1>Discover Your Dream Home</h1>
          <p>
            Explore our exclusive collection of premium properties designed for modern living. 
            Schedule a visit today.
          </p>
          <div className="hero-actions">
            {firstLink && (
              <Link to={firstLink.path} className="btn btn-accent" style={{ textDecoration: 'none' }}>
                Schedule a Visit
              </Link>
            )}
            <a href="#gallery" className="btn-outline-light" style={{ textDecoration: 'none' }}>
              View Gallery
            </a>
          </div>
        </div>
      </section>

      {/* ─── Project Showcase ─── */}
      <section className="pub-section">
        <div className="pub-container">
          <div className="project-showcase">
            <div className="project-showcase-image">
              {projectImg?.url ? (
                <img src={projectImg.url} alt={projectImg.alt || 'Project showcase'} />
              ) : (
                <div className="project-showcase-image-placeholder">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>
            <div className="project-showcase-content">
              <h3>Premium Living Spaces</h3>
              <p>
                Thoughtfully designed residences featuring contemporary architecture, 
                world-class amenities, and strategic locations that offer convenience 
                and connectivity. Every detail has been crafted with quality and 
                comfort in mind.
              </p>
              {firstLink && (
                <Link to={firstLink.path} className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  Enquire Now
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Gallery ─── */}
      <section className="pub-section" id="gallery">
        <div className="pub-container">
          <div className="pub-section-header">
            <div className="section-eyebrow">Gallery</div>
            <h2>Visual Tour</h2>
            <p>Browse through our project images, amenities, and floor plans.</p>
          </div>
          {allGallery.length > 0 ? (
            <div className="gallery-grid">
              {allGallery.map((img) => (
                <div className={`gallery-item${img.slot === 'floorplan' ? ' floorplan' : ''}`} key={img.id}>
                  <img src={img.url} alt={img.alt || img.name} />
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 'var(--sp-2xl) 0', color: 'var(--clr-text-tertiary)' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3, marginBottom: 12 }}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <p style={{ fontSize: 'var(--fs-sm)' }}>Gallery images will appear here once uploaded via the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="cta-section">
        <div className="pub-container" style={{ maxWidth: 640 }}>
          <h2>Ready to Find Your Next Home?</h2>
          <p>
            Get in touch with our team to learn more about available properties, 
            pricing, and exclusive offers.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {firstLink && (
              <Link to={firstLink.path} className="btn btn-accent btn-lg" style={{ textDecoration: 'none' }}>
                Get Started
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* ─── Connect / Forms Section ─── */}
      {(state.links.length > 0 || state.forms.length > 0) && (
        <section className="pub-section pub-section-alt">
          <div className="pub-container">
            <div className="pub-section-header">
              <div className="section-eyebrow">Connect</div>
              <h2>Get in Touch</h2>
              <p>Choose the enquiry type that best fits your needs.</p>
            </div>

            {/* Linked forms — displayed as clickable cards */}
            {state.links.length > 0 && (
              <div className="links-grid">
                {state.links.map((link) => {
                  const form = state.forms.find((f) => f.id === link.formId);
                  return (
                    <Link to={link.path} key={link.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="link-card">
                        <h3>{link.name}</h3>
                        <p>
                          {form
                            ? `${form.fields.length} field${form.fields.length !== 1 ? 's' : ''}`
                            : 'No form assigned'}
                        </p>
                        <span className="btn btn-primary btn-sm">Fill Form →</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* All forms — show every form (linked or not) as an info card */}
            {state.forms.length > 0 && (
              <>
                {state.links.length > 0 && (
                  <div className="pub-section-subheader">
                    <div className="section-eyebrow" style={{ marginTop: 'var(--sp-2xl)' }}>All Forms</div>
                  </div>
                )}
                <div className="forms-list-grid">
                  {state.forms.map((form) => {
                    const linkedLink = state.links.find((l) => l.formId === form.id);
                    return (
                      <div key={form.id} className="form-info-card">
                        <div className="form-info-card-header">
                          <h3>{form.name}</h3>
                          <span className="badge badge-default">
                            {form.fields.length} field{form.fields.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="form-info-card-desc">
                          {form.successMessage || 'Fill in the form and submit your enquiry.'}
                        </p>
                        {linkedLink ? (
                          <Link
                            to={linkedLink.path}
                            className="btn btn-primary btn-sm"
                            style={{ textDecoration: 'none', alignSelf: 'flex-start' }}
                          >
                            Open Form →
                          </Link>
                        ) : (
                          <span className="badge badge-warning">Not yet published</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
