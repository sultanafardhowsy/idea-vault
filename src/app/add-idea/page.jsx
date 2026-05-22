'use client';

import { authClient } from '@/lib/auth-client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

/* ── Read dark mode from <html class="dark"> ── */
function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () => setDark(document.documentElement.classList.contains('dark'));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

export default function NewIdeaPage() {
  const dark = useIsDark();
  const [imageUrl, setImageUrl]     = useState('');
  const [tags, setTags]             = useState('');
  const [submitting, setSubmitting] = useState(false);

  /* Default date created to today */
  const todayISO = new Date().toISOString().split('T')[0];

   const { data: session } = authClient.useSession();

  const user = session?.user;
  console.log(user);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.target);
    const payload = {
      title:              formData.get('title'),
      shortDescription:   formData.get('shortDescription'),
      category:           formData.get('category'),
      description:        formData.get('description'),
      targetAudience:     formData.get('targetAudience'),
      problemStatement:   formData.get('problemStatement'),
      proposedSolution:   formData.get('proposedSolution'),
      founder:            formData.get('founder'),
      status:             formData.get('status') || 'New',
      funding:            formData.get('funding') || '$0',
      imageUrl:           formData.get('imageUrl') || '',
      tags:               formData.get('tags')
        ? formData.get('tags').split(',').map(t => t.trim()).filter(Boolean)
        : [],
      createdAt:          formData.get('createdAt') || todayISO,

       email: user?.email,
      
    };
    try {
      const res = await fetch('http://localhost:5000/allidea', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('🎉 Idea published successfully!');
      setTimeout(() => { window.location.href = '/'; }, 1200);
    } catch (err) {
      console.error('Submission failed:', err);
      toast.error('❌ Failed to publish idea. Please try again.');
      setSubmitting(false);
    }
  }

  const tagList = tags.split(',').map(t => t.trim()).filter(Boolean);

  /* ── Fully Harmonized Design Tokens ── */
  const token = {
    pageBg:        dark ? '#0d0f14'  : '#ddeeff',
    cardBg:        dark ? '#13161d'  : '#ffffff',
    cardBorder:    dark ? '#1e2535'  : '#b8d8f0',
    headerBg:      dark ? '#161922'  : '#eaf5ff',
    headerBorder:  dark ? '#1e2535'  : '#c2e0f7',
    titleColor:    dark ? '#ffffff'  : '#1d6fa8',
    subColor:      dark ? '#94a3b8'  : '#5a9ac0',
    labelColor:    dark ? '#94a3b8'  : '#1d6fa8',
    divider:       dark ? '#1e2535'  : '#c2e0f7',
    breadMuted:    dark ? '#64748b'  : '#7aaac8',
    sectionLabel:  dark ? '#c9a96e'  : '#b5803a',

    /* Field tokens */
    fieldBg:       dark ? '#0f1420'  : '#d6edfb',
    fieldBorder:   dark ? '#252c42'  : '#93c9e8',
    fieldText:     dark ? '#ffffff'  : '#1d6fa8',
    fieldPh:       dark ? '#4e5d78'  : '#7aaac8',
    fieldFocusBdr: dark ? '#c9a96e'  : '#1d6fa8',

    /* Button */
    btnBg:         dark ? '#c9a96e'  : '#1d6fa8',
    btnText:       dark ? '#0d0f14'  : '#ffffff',
  };

  /* ── Structural layout properties shared by all fields ── */
  const baseFieldStyle = {
    display: 'block',
    width: '100%',
    borderRadius: '12px',
    border: `1px solid ${token.fieldBorder}`,
    backgroundColor: token.fieldBg,
    color: token.fieldText,
    fontSize: '14px',
    fontFamily: "'Epilogue', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s, background-color 0.2s',
  };

  const fieldStyle = {
    ...baseFieldStyle,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
  };

  const selectStyle = {
    ...baseFieldStyle,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '40px',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${encodeURIComponent(token.fieldText)}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  };

  const textareaStyle = {
    ...baseFieldStyle,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    resize: 'vertical',
    minHeight: '110px',
    lineHeight: '1.6',
  };

  const textareaSmStyle = {
    ...textareaStyle,
    minHeight: '80px',
  };

  const focusHandlers = {
    onFocus: e => { e.target.style.borderColor = token.fieldFocusBdr; e.target.style.boxShadow = `0 0 0 3px ${token.fieldFocusBdr}26`; },
    onBlur:  e => { e.target.style.borderColor = token.fieldBorder;   e.target.style.boxShadow = 'none'; },
  };

  const SectionDivider = ({ label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px', marginBottom: '4px' }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: token.divider }} />
      <span style={{
        fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: token.sectionLabel,
        whiteSpace: 'nowrap',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', backgroundColor: token.divider }} />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Epilogue:wght@300;400;500;600&display=swap');

        .nip-fadein { animation: fadeUp 0.45s ease both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes nip-spin { to { transform: rotate(360deg); } }
        .nip-spinner {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: nip-spin 0.7s linear infinite;
        }

        .nip-input-field::placeholder { color: ${token.fieldPh} !important; opacity: 1; }
        .nip-input-field::-webkit-input-placeholder { color: ${token.fieldPh} !important; }
        .nip-input-field::-moz-placeholder { color: ${token.fieldPh} !important; }

        .nip-select option {
          background-color: ${token.cardBg};
          color: ${token.fieldText};
        }

        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: ${dark ? 'invert(1) opacity(0.5)' : 'opacity(0.4)'};
          cursor: pointer;
        }
      `}</style>

      {/* Page shell */}
      <div style={{
        minHeight: '100vh',
        backgroundColor: token.pageBg,
        fontFamily: "'Epilogue', sans-serif",
        paddingTop: '3rem',
        paddingBottom: '3rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        transition: 'background-color 0.3s',
        boxSizing: 'border-box'
      }}>
        <div className="nip-fadein" style={{ maxWidth: '680px', margin: '0 auto' }}>

          {/* Breadcrumb */}
          <p style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: token.breadMuted, marginBottom: '16px' }}>
            Vault /{' '}
            <span style={{ color: dark ? '#c9a96e' : '#b5803a' }}>New Idea</span>
          </p>

          {/* Main Container Card */}
          <div style={{
            borderRadius: '20px',
            overflow: 'hidden',
            backgroundColor: token.cardBg,
            border: `1px solid ${token.cardBorder}`,
            boxShadow: dark
              ? '0 24px 60px rgba(0,0,0,0.6)'
              : '0 12px 40px rgba(29,111,168,0.08)',
            transition: 'background-color 0.3s, border-color 0.3s',
          }}>

            {/* Card Header */}
            <div style={{
              paddingTop: '2rem',
              paddingBottom: '2rem',
              paddingLeft: '2.5rem',
              paddingRight: '2.5rem',
              backgroundColor: token.headerBg,
              borderBottom: `1px solid ${token.headerBorder}`,
              transition: 'background-color 0.3s',
            }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: '2rem',
                fontWeight: 800,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                color: token.titleColor,
                margin: 0,
                transition: 'color 0.3s',
              }}>
                Submit an{' '}
                <span style={{ color: dark ? '#c9a96e' : '#b5803a' }}>Innovation</span>
                {' '}Idea
              </h1>
              <p style={{ marginTop: '8px', fontSize: '13px', color: token.subColor, transition: 'color 0.3s' }}>
                Fill out the fields below to add your project to the platform.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ paddingTop: '2.5rem', paddingBottom: '2.5rem', paddingLeft: '2.5rem', paddingRight: '2.5rem', display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* ── BASIC INFO ── */}
              <SectionDivider label="Basic Info" />

              {/* Project Title */}
              <Field label="Project Title" required token={token}>
                <input
                  className="nip-input-field"
                  style={fieldStyle}
                  type="text" name="title" required
                  placeholder="e.g., SkillSwap"
                  {...focusHandlers}
                />
              </Field>

              {/* Short Description */}
              <Field label="Short Description" required hint="one-liner" token={token}>
                <input
                  className="nip-input-field"
                  style={fieldStyle}
                  type="text" name="shortDescription" required
                  placeholder="A marketplace for exchanging skills without money"
                  {...focusHandlers}
                />
              </Field>

              {/* Category & Status Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <Field label="Category" required token={token}>
                  <select className="nip-select" style={selectStyle} name="category" required {...focusHandlers}>
                    <option value="Education">Education</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Technology">Technology</option>
                    <option value="Health">Health</option>
                    <option value="Finance">Finance</option>
                  </select>
                </Field>

                <Field label="Status" token={token}>
                  <select className="nip-select" style={selectStyle} name="status" {...focusHandlers}>
                    <option value="New">New</option>
                    <option value="Trending">Trending</option>
                    <option value="Active">Active</option>
                  </select>
                </Field>
              </div>

              {/* Date Created */}
              <Field label="Date Created" token={token}>
                <input
                  className="nip-input-field"
                  style={fieldStyle}
                  type="date" name="createdAt"
                  defaultValue={todayISO}
                  {...focusHandlers}
                />
              </Field>

              {/* ── PROJECT DETAILS ── */}
              <SectionDivider label="Project Details" />

              {/* Description */}
              <Field label="Description" required token={token}>
                <textarea
                  className="nip-input-field"
                  style={textareaStyle} name="description" required
                  placeholder="Describe how your project works..."
                  {...focusHandlers}
                />
              </Field>

              {/* Target Audience */}
              <Field label="Target Audience" required token={token}>
                <textarea
                  className="nip-input-field"
                  style={textareaSmStyle} name="targetAudience" required
                  placeholder="e.g., University students, freelancers, and career changers aged 18–35 in urban areas"
                  {...focusHandlers}
                />
              </Field>

              {/* ── PROBLEM & SOLUTION ── */}
              <SectionDivider label="Problem & Solution" />

              {/* Problem Statement */}
              <Field label="Problem Statement" required token={token}>
                <textarea
                  className="nip-input-field"
                  style={textareaSmStyle} name="problemStatement" required
                  placeholder="What problem does your project solve? Why does it matter?"
                  {...focusHandlers}
                />
              </Field>

              {/* Proposed Solution */}
              <Field label="Proposed Solution" required token={token}>
                <textarea
                  className="nip-input-field"
                  style={textareaSmStyle} name="proposedSolution" required
                  placeholder="How does your project address the problem? What's your approach?"
                  {...focusHandlers}
                />
              </Field>

              {/* ── TEAM & FUNDING ── */}
              <SectionDivider label="Team & Funding" />

              {/* Founder & Funding Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <Field label="Founder Name" required token={token}>
                  <input
                    className="nip-input-field"
                    style={fieldStyle} type="text" name="founder" required
                    placeholder="Sarah Ahmed"
                    {...focusHandlers}
                  />
                </Field>

                <Field label="Funding Amount" token={token}>
                  <input
                    className="nip-input-field"
                    style={fieldStyle} type="text" name="funding"
                    placeholder="e.g., $25,000"
                    {...focusHandlers}
                  />
                </Field>
              </div>

              {/* ── MEDIA ── */}
              <SectionDivider label="Media & Tags" />

              {/* Cover Image URL */}
              <Field label="Cover Image URL" token={token}>
                <input
                  className="nip-input-field"
                  style={fieldStyle} type="url" name="imageUrl"
                  placeholder="https://example.com/cover.png"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  {...focusHandlers}
                />
                {imageUrl ? (
                  <img src={imageUrl}
                       alt="Project preview"
                       style={{ width: '100%', maxWidth: '300px', height: '300px', objectFit: 'cover', borderRadius: '12px' }} />
                ) : (
                  <div style={{
                    marginTop: '12px', width: '100%', height: '80px', borderRadius: '12px',
                    border: `1px dashed ${token.fieldBorder}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', color: token.fieldPh, gap: '6px',
                    backgroundColor: dark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'
                  }}>
                    🖼 Preview will appear here
                  </div>
                )}
              </Field>

              {/* Tags */}
              <Field label="Tags" hint="comma-separated" token={token}>
                <input
                  className="nip-input-field"
                  style={fieldStyle} type="text" name="tags"
                  placeholder="education, skills, community"
                  value={tags}
                  onChange={e => setTags(e.target.value)}
                  {...focusHandlers}
                />
                {tagList.length > 0 && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                    {tagList.map((tag, i) => (
                      <span key={i} style={{
                        fontSize: '12px', fontWeight: 500,
                        paddingTop: '4px', paddingBottom: '4px', paddingLeft: '14px', paddingRight: '14px',
                        borderRadius: '999px',
                        backgroundColor: dark ? 'rgba(201,169,110,0.15)' : 'rgba(29,111,168,0.08)',
                        color: dark ? '#c9a96e' : '#1d6fa8',
                        border: `1px solid ${dark ? 'rgba(201,169,110,0.3)' : 'rgba(29,111,168,0.25)'}`,
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Field>

              {/* Submit Button */}
              <button
                type="submit" disabled={submitting}
                style={{
                  width: '100%', paddingTop: '14px', paddingBottom: '14px', borderRadius: '12px',
                  border: 'none', cursor: submitting ? 'not-allowed' : 'pointer',
                  fontFamily: "'Syne', sans-serif", fontSize: '15px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  backgroundColor: token.btnBg,
                  color: token.btnText,
                  opacity: submitting ? 0.6 : 1,
                  boxShadow: dark
                    ? '0 6px 24px rgba(201,169,110,0.2)'
                    : '0 6px 24px rgba(29,111,168,0.2)',
                  transition: 'transform 0.18s, box-shadow 0.18s, opacity 0.18s',
                  marginTop: '8px'
                }}
                onMouseEnter={e => { if (!submitting) { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = dark ? '0 10px 32px rgba(201,169,110,0.35)' : '0 10px 32px rgba(29,111,168,0.3)'; }}}
                onMouseLeave={e => { e.target.style.transform = 'none'; e.target.style.boxShadow = dark ? '0 6px 24px rgba(201,169,110,0.2)' : '0 6px 24px rgba(29,111,168,0.2)'; }}
              >
                {submitting
                  ? <><span className="nip-spinner" /> Publishing...</>
                  : '→ Publish Project Idea'
                }
              </button>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Field wrapper ── */
function Field({ label, required, hint, token, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <label style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        fontSize: '11px', fontWeight: 600, letterSpacing: '0.07em',
        textTransform: 'uppercase', color: token.labelColor,
        transition: 'color 0.3s',
      }}>
        {label}
        {required && <span style={{ color: '#b5803a', fontSize: '14px', lineHeight: 1 }}>*</span>}
        {hint && <span style={{ textTransform: 'none', letterSpacing: 0, fontWeight: 400, fontSize: '11px', color: token.fieldPh }}>({hint})</span>}
      </label>
      {children}
    </div>
  );
}
