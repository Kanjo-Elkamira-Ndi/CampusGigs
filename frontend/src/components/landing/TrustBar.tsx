const UNIVERSITIES = [
  "University of Yaoundé I",
  "University of Buea",
  "YIBS",
  "ICT University",
  "University of Douala",
  "University of Dschang",
];

export function TrustBar() {
  return (
    <section style={{ backgroundColor: "var(--section-bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-center text-sm font-medium mb-8" style={{ color: "var(--text-secondary)" }}>
          Trusted by leading universities in Cameroon and communities across the country
        </p>
        <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
          {UNIVERSITIES.map((name) => (
            <span
              key={name}
              className="text-base font-semibold tracking-wide grayscale"
              style={{ color: "var(--text-muted)", letterSpacing: "0.02em" }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
