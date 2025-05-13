const mustache = require("mustache"); // install this via: npm i mustache
const fs = require("fs-extra");
const path = require("path");
const ftp = require("basic-ftp");
async function generateCourseSchema(course, lang, instructorsList) {
  const schemaPath = path.join(__dirname, "..", "Seo", "Schema", "course.html");
  const schemaTemplate = await fs.readFile(schemaPath, "utf-8");
  const view = {
    course_url: `https://360business-partners.com/${
      lang === "ar" ? "ar/" : ""
    }courses/${course.id}`,
    course_name: course?.HeroSection?.seo_title || course?.name || "Course",
    course_description:
      course?.HeroSection?.subtitle ||
      course?.CourseOverview?.description ||
      "",
    course_image_url: course?.image || defaultImage,
    course_currency: course?.currency || "SAR",
    course_price: course?.CourseOverview?.price || 0,
    course_publish_date:
      course?.publishDate || new Date().toISOString().split("T")[0],
    course_level: course?.level || "Beginner",
    course_about:
      course?.CourseOverview?.description ||
      course?.HeroSection?.subtitle ||
      "",
    primary_language: lang === "ar" ? "ar" : "en",
    credential_name: course?.certificateName || "Completion Certificate",
    course_start_date: course?.courseStartDate || "2025-01-01",
    course_end_date: course?.courseEndDate || "2025-12-31",
    instructor_list: (course?.instructors || [])
      .map((id) => {
        const instr = instructorsList?.[id];
        return instr
          ? `{
          "@type": "Person",
          "name": "${instr.name}",
          "description": "${instr.jobTitle}"
        }`
          : null;
      })
      .filter(Boolean)
      .join(",\n"),
    syllabus_sections_json: (course?.syllabus || [])
      .map((s) => JSON.stringify(s))
      .join(",\n"),
  };

  return mustache.render(schemaTemplate, view);
}
async function generateBlogSchema(blog, lang) {
  const schemaPath = path.join(__dirname, "..", "Seo", "Schema", "blog.html");
  const schemaTemplate = await fs.readFile(schemaPath, "utf-8");

  const view = {
    blog_url: `https://360business-partners.com/${
      lang === "ar" ? "ar/" : ""
    }blog/${blog.slug}`,
    blog_title: blog.title,
    blog_subtitle_or_secondary_title:
      blog.meta_description || blog.category || blog.title,
    blog_meta_description: blog.meta_description || blog.description || "",
    blog_featured_image:
      blog.image || "https://360business-partners.com/assets/placeholder.png",
    author_name: blog.author || "360 Team",
    author_slug: (blog.author || "360 Team").toLowerCase().replace(/\s+/g, "-"),
    editor_name: blog.editor || blog.author || "360 Team",
    publish_date: blog.date || new Date().toISOString(),
    modified_date: blog.modified || blog.date || new Date().toISOString(),
    language_code: lang === "ar" ? "ar" : "en",
    comma_separated_keywords: `"${blog.category || "blog"}", "360 Business"`,
    stripped_down_html_or_plain_text_excerpt:
      blog.content?.replace(/<[^>]+>/g, "").slice(0, 250) || "",
  };

  return mustache.render(schemaTemplate, view);
}

async function uploadDirectory(client, localDir, remoteDir) {
  await client.ensureDir(remoteDir);
  await client.cd(remoteDir);

  const items = await fs.readdir(localDir);

  for (const item of items) {
    const localPath = path.join(localDir, item);
    const remotePath = path.posix.join(remoteDir, item);
    const stat = await fs.stat(localPath);

    if (stat.isDirectory()) {
      await uploadDirectory(client, localPath, remotePath);
    } else {
      await client.uploadFrom(localPath, remotePath);
      console.log(`✅ Uploaded file: ${remotePath}`);
    }
  }
}

async function uploadToFtp() {
  const client = new ftp.Client();
  try {
    await client.access({
      host: "360business-partners.com",
      user: "ahmed123mah@360business-partners.com",
      password: "#QYtWHXX}!f+",
      secure: false,
    });

    const localOutputDir = path.join(__dirname, "..", "Seo", "Output");
    const remoteOutputDir = "/"; // change if needed

    console.log("🚀 Uploading Output folder to FTP...");
    await uploadDirectory(client, localOutputDir, remoteOutputDir);
    console.log("✅ Upload complete!");
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
  } finally {
    client.close();
  }
}

module.exports = {
  uploadToFtp,
  generateCourseSchema,
  generateBlogSchema,
};
