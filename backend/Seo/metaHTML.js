const fs = require("fs-extra");
const path = require("path");
const ftp = require("basic-ftp");
const {
  generateCourseSchema,
  generateBlogSchema,
  uploadToFtp,
} = require(".././utility/utility");
const seoOutputPath = path.resolve(__dirname, "Output");
const defaultImage =
  "https://github.com/user-attachments/assets/13970716-7b8e-4148-a27e-d96184e118a1";

const excludedSections = [
  "banners",
  "business_partners",
  "common",
  "navbar",
  "notFound",
  "footer",
  "blog",
];

// === Section-based meta config ===
const metaConfig = {
  home: {
    title: (d) => d.hero_section?.title,
    description: (d) => d.hero_section?.description,
    route: () => "",
  },
  about: {
    title: (d) => d.HeroSection?.seo_title,
    description: (d) => d.About360BusinessPartner?.subtitle,
    route: () => "about-us",
  },
  contact: {
    title: (d) => d.HeroSection?.seo_title,
    description: (d) => d.Welcomephrase?.subtitle,
    route: () => "contact-us",
  },
  blog: {
    title: (d) => d.title,
    description: (d) => d.description,
    route: () => "blog",
  },
  teams: {
    title: (d) => d.HeroSection?.seo_title,
    description: (d) => d.HeroSection?.subtitle_,
    route: () => "teams",
  },
  partner: {
    title: (d) => d.HeroSection?.seo_title,
    description: (d) => d.HeroSection?.subtitle,
    route: () => "partner",
  },
};

// === Step 1: Fetch translation JSON or HTML via FTP ===
async function fetchTranslationFile(filePathOnServer) {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "360business-partners.com",
      user: "ahmed123mah@360business-partners.com",
      password: "#QYtWHXX}!f+",
      secure: false,
    });

    // ⬇️ Full local path based on server path (preserving structure)
    const localPath = path.join(__dirname, "..", filePathOnServer);

    // ⬇️ Ensure local folder exists
    await fs.ensureDir(path.dirname(localPath));

    // ⬇️ Download from FTP to correct local location
    await client.downloadTo(localPath, filePathOnServer);
    console.log(`✅ Downloaded ${filePathOnServer} → ${localPath}`);

    const fileContent = await fs.readFile(localPath, "utf-8");
    return filePathOnServer.endsWith(".json")
      ? JSON.parse(fileContent)
      : fileContent;
  } catch (err) {
    console.error(`❌ Error fetching ${filePathOnServer}:`, err.message);
    return null;
  } finally {
    client.close();
  }
}

// === Step 2: Extract meta using metaConfig ===
function extractPageMeta(sectionKey, sectionData) {
  const config = metaConfig[sectionKey];
  if (!config) return null;

  const title = config.title?.(sectionData) || "360 Business";
  const description =
    config.description?.(sectionData) ||
    "Advance Your Career with Expert Finance Courses";
  const image =
    config.image?.(sectionData) || sectionData?.image || defaultImage;
  const route = config.route?.(sectionData) || sectionData.route || sectionKey;

  return { title, description, image, route };
}

// === Step 3: Generate HTML with meta tags ===
function generateHtml(meta, route, lang, baseHtml) {
  const prefix = lang === "ar" ? "ar/" : "";
  const url = `https://360business-partners.com/${prefix}${route}`;
  const metaTags = `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}">
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${meta.image}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${meta.image}" />
    <link rel="canonical" href="${url}/" />
    <link rel="alternate" href="https://360business-partners.com/${route}/" hrefLang="en" />
    <link rel="alternate" href="https://360business-partners.com/ar/${route}/" hrefLang="ar" />
    <link rel="alternate" href="https://360business-partners.com/${route}/" hrefLang="x-default" />
  `;
  return baseHtml.replace(/<title>.*?<\/title>/, metaTags.trim());
}

// === Step 4: Process translation and generate HTML ===
async function processTranslation(data, outputDir, lang, baseHtml) {
  await fs.ensureDir(outputDir);

  for (const [key, value] of Object.entries(data)) {
    if (excludedSections.includes(key)) continue;
    if (typeof value === "object") {
      const meta = extractPageMeta(key, value);
      if (!meta) continue;

      let filePath;
      if (meta.route === "home") {
        // Generate seo/index.html for home
        await fs.ensureDir(outputDir);
        filePath = path.join(outputDir, "index.html");
      } else {
        const folder = path.join(outputDir, meta.route);
        await fs.ensureDir(folder);
        filePath = path.join(folder, "index.html");
      }
      const htmlContent = generateHtml(meta, meta.route, lang, baseHtml);
      await fs.writeFile(filePath, htmlContent, "utf-8");
    }
  }

  // Generate course pages
  if (data?.courses?.coursesData?.length) {
    const courses = data.courses.coursesData;

    // ✅ 1. Create main courses/index.html
    const coursesMainMeta = {
      title:
        data.courses?.seo_title ||
        (lang === "ar" ? "الدورات التدريبية" : "Courses"),
      description:
        data.courses?.description ||
        (lang === "ar"
          ? "طوّر مسارك المهني مع أفضل الشهادات في المالية والمحاسبة، متوفرة عبر الإنترنت والحضور المباشر."
          : "Advance your career with leading finance and accounting certifications available online and offline."),
      image: data.courses?.image || defaultImage,
    };

    const coursesDir = path.join(outputDir, "courses");
    await fs.ensureDir(coursesDir);
    const coursesMainHtml = generateHtml(
      coursesMainMeta,
      "courses",
      lang,
      baseHtml
    );
    await fs.writeFile(
      path.join(coursesDir, "index.html"),
      coursesMainHtml,
      "utf-8"
    );

    // ✅ 2. Generate each course in its own folder inside `courses/`
    for (const course of courses) {
      const meta = {
        title: course?.HeroSection?.seo_title || course?.name,
        description:
          course?.HeroSection?.subtitle || course?.CourseOverview?.description,
        image: course?.image || defaultImage,
      };

      const courseId = course.id;
      const courseFolder = path.join(coursesDir, courseId);
      await fs.ensureDir(courseFolder);
      const route = `courses/${courseId}`;
      let htmlContent = generateHtml(meta, route, lang, baseHtml);
      const schema = await generateCourseSchema(course, lang);
      htmlContent = htmlContent.replace("</head>", `${schema}\n</head>`);
      await fs.writeFile(
        path.join(courseFolder, "index.html"),
        htmlContent,
        "utf-8"
      );
    }

    // ✅ 3. Paginated course listings: /courses/page/1, /courses/page/2...
    const perPage = 12;
    const totalPages = Math.ceil(courses.length / perPage);
    for (let page = 0; page < totalPages; page++) {
      const pageDir = path.join(coursesDir, "page", `${page + 1}`);
      await fs.ensureDir(pageDir);

      const meta = {
        title:
          lang === "ar"
            ? `الدورات التدريبية - الصفحة ${page + 1}`
            : `Courses - Page ${page + 1}`,
        description:
          data.courses?.description ||
          (lang === "ar"
            ? "طوّر مسارك المهني مع أفضل الشهادات في المالية والمحاسبة، متوفرة عبر الإنترنت والحضور المباشر."
            : "Advance your career with leading finance and accounting certifications available online and offline."),
        image: defaultImage,
      };
      const route = `courses/page/${page + 1}`;
      let htmlContent = generateHtml(meta, route, lang, baseHtml);
      await fs.writeFile(
        path.join(pageDir, "index.html"),
        htmlContent,
        "utf-8"
      );
    }
  }

  // ✅ Generate blog main and blog posts
  if (data.blog?.blogs?.length) {
    const blogDir = path.join(outputDir, "blog");
    await fs.ensureDir(blogDir);

    // ✅ 1. Create blog index.html (blog list page)
    const blogMainMeta = {
      title: data.blog?.title || (lang === "ar" ? "المدونة" : "Our Blog"),
      description:
        data.blog?.description ||
        (lang === "ar"
          ? "تابع أحدث مقالاتنا ونصائحنا في مجال الأعمال والمالية."
          : "Stay ahead of the curve with our latest blog releases"),
      image: data.blog?.image || defaultImage,
    };
    const blogMainHtml = generateHtml(blogMainMeta, "blog", lang, baseHtml);
    await fs.writeFile(path.join(blogDir, "index.html"), blogMainHtml, "utf-8");

    // ✅ 2. Generate blog post pages by slug
    const seenSlugs = new Set(); // prevent duplicates
    for (const blog of data.blog.blogs) {
      const slug = blog.slug;
      if (!slug || seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      const meta = {
        title: blog.title,
        description: blog.meta_description || blog.description,
        image: blog.image || defaultImage,
      };

      const route = `blog/${slug}`;
      const folder = path.join(blogDir, slug);
      await fs.ensureDir(folder);
      let htmlContent = generateHtml(meta, route, lang, baseHtml);
      const schema = await generateBlogSchema(blog, lang);
      htmlContent = htmlContent.replace("</head>", `${schema}\n</head>`);
      await fs.writeFile(path.join(folder, "index.html"), htmlContent, "utf-8");
    }
  }
}

// === Step 5: Main logic ===
async function main() {
  const baseHtml = await fetchTranslationFile("index.html");
  const enData = await fetchTranslationFile("locales/en/translation.json");
  const arData = await fetchTranslationFile("locales/ar/translation.json");

  if (enData) {
    await processTranslation(enData, seoOutputPath, "en", baseHtml);
  }

  if (arData) {
    await processTranslation(
      arData,
      path.join(seoOutputPath, "ar"),
      "ar",
      baseHtml
    );
  }

  console.log("✅ All SEO HTML pages generated successfully.");
  await uploadToFtp();
}

main().catch((err) => console.error("💥 Error:", err));
