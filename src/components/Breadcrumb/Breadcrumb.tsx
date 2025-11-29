import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  href: string;
  current?: boolean;
}

interface BreadcrumbProps {
  pages: BreadcrumbItem[];
}

const Breadcrumb = ({ pages }: BreadcrumbProps) => {
  
  // Add JSON-LD structured data for breadcrumbs
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": pages.map((page, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": page.name,
      "item": `https://satyamexport.com${page.href}`
    }))
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Visual Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <div className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-green-600">
                Home
              </Link>
            </div>
          </li>
          {pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <Link 
                  href={page.href} 
                  className={`ml-2 text-sm font-medium ${page.current ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}
                  aria-current={page.current ? 'page' : undefined}
                >
                  {page.name}
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumb;