---
title: "How to write content for a Hugo project"
weight: 2
chapter: false
pre: " <b> 0.2. </b> "
---

# Content

#### Content

#### **Title**

There is this header at the top of every page to display the **title** and define the navigation on the **Navigation panel on the left side of the page**.

- `title = "Write content"`
- `chapter = false` : Leave the default as false. The title above will also display as h1 in the article.
- `weight`: Used to sort the index of the title
- `pre = "<b>2. </b>"` : This is the numbering for the page displayed in **Navigation panel on the left**.

```
---
title : "Writing Content"
date : "`r Sys.Date()`"
weight : 2
chapter : false
pre : " <b> 2. </b> "
---

```

#### **Heading Section**

- We will agree to use the title for the sections in a page will use h4 (####).

#### **Table of Contents (TOC)**

1. After writing the content (or finishing listing the Headings of a page), we can build **Table of Contents (TOC)** automatically by plug-in.
2. Use the key combination `Ctrl + Shift + P` then type in **Create Table of Contents** and select the plug-in option **Markdown All in One**. Enter.

We will have a TOC like this:

Content:

```
- [**Cách viết một Lab Guide**](#cách-viết-một-lab-guide)
	- [**I. Phần 1: Chuẩn bị**](#i-phần-1-chuẩn-bị)
	- [II. **Phần 2: Nội dung**](#ii-phần-2-nội-dung)
	- [1. Cấu trúc file](#1-cấu-trúc-file)
			- [**Thư mục *content***](#thư-mục-content)
			- [**Thư mục *static/images***](#thư-mục-staticimages)
			- [**Thư mục *public***](#thư-mục-public)
	- [2. Nội dung](#2-nội-dung)
			- [**Phần tiêu đề**](#phần-tiêu-đề)
			- [**Phần heading**](#phần-heading)
			- [**Phần Table of Contents (TOC)**](#phần-table-of-contents-toc)
			- [**Phần ghi chú**](#phần-ghi-chú)
			- [**Phần tập tin đính kèm**](#phần-tập-tin-đính-kèm)
			- [**Phần vẽ bảng**](#phần-vẽ-bảng)
			- [**Phần hình ảnh**](#phần-hình-ảnh)
		- [**Update config.toml**](#update-configtoml)

```

#### Insert icons in the intro

1. We use the icon set downloaded from AWS [here](https://aws.amazon.com/en/architecture/icons/)
2. Execute the insert command as follows:

```
{< figure src="../images/fcj.png" title="First Cloud Journey" width=150pc >}
```

#### **Notices** (use Hugo theme's shortcode)

In the article, there may be paragraphs that need to be highlighted such as Notes, Warnings,… then the shortcode will be used according to the instructions at [here](https://learn.netlify.app/en/shortcodes/notice)

##### Note

```
{{%/* notice note */%}}
A notice disclaimer
{{%/* /notice */%}}
```

renders as

{{% notice note %}}
A notice disclaimer
{{% /notice %}}

##### Info

```
{{%/* notice info */%}}
An information disclaimer
{{%/* /notice */%}}
```

renders as

{{% notice info %}}
An information disclaimer
{{% /notice %}}

##### Tip

```
{{%/* notice tip */%}}
A tip disclaimer
{{%/* /notice */%}}
```

renders as

{{% notice tip %}}
A tip disclaimer
{{% /notice %}}

##### Warning

```
{{%/* notice warning */%}}
An warning disclaimer
{{%/* /notice */%}}
```

renders as

{{% notice warning %}}
A warning disclaimer
{{% /notice %}}

#### Notice using GitHub syntax

```text
> [!NOTE]
> Useful information that users should know, even when skimming content.
```

renders as

> [!NOTE]
> Useful information that users should know, even when skimming content.

```text
> [!TIP]
> Helpful advice for doing things better or more easily.
```

renders as

> [!TIP]
> Helpful advice for doing things better or more easily.

```text
> [!IMPORTANT]
> Key information users need to know to achieve their goal.
```

renders as

> [!IMPORTANT]
> Key information users need to know to achieve their goal.

```text
> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.
```

renders as

> [!WARNING]
> Urgent info that needs immediate user attention to avoid problems.

```text
> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.
```

> [!CAUTION]
> Advises about risks or negative outcomes of certain actions.

#### **Attachment file**

1. This section will follow the instructions at [here](https://learn.netlify.app/en/shortcodes/attachments/)
2. **The file location will be in the directory corresponding to the md.** page name as follows:

- **\_index.md** —> **\_index.files**
- **\_index.vi.md** —> **\_index.vi.files**

That is, if there are many languages, each language has 1 such directory for 1 page.

3. **Use the following shortcode to create an attachment:**

- **title** : Title of attachment
- **pattern** : Identify the files displayed in the box (you can leave the filename or pattern to identify the tail)
- Example filter file Dockerfile:

<!--
```
#{{%attachments title="Dockerfile" pattern="Dockerfile"/%}}
```
-->

- Example file filtering by extension:

<!--
```
{{%attachments title="Build Scripts" pattern=".*(ps1|sh)"/%}}

```
-->

#### **Table drawing**

To simplify drawing tables, writers often use the tool [Tables Generator](https://www.tablesgenerator.com/markdown_tables)

1. Go to the page.
2. After entering the content, click **Generate** and then **Copy to clipboard**.
3. Done here **Paste** in.

#### **Image Section**

1. **Recommended screen capture software:** SnagIt (2019/2020)
2. **Image design:**

To create uniformity and easy understanding for viewers, we define a common standard as follows:

- About Screenshot Console:
- **Browser:** Chrome disable Bookmark bar (recommended)
- **Zoom:** Default does not zoom in (100%)
- **Screen Resolution:** FullHD (1920 x 1080)
- **Format:** PNG (Recommended)
- About the font inscribed on the picture:
- **Font:** Arial Black
- **Size:** 18
- **No** enable Shadow.
- Regarding the area marking frame to pay attention:
  - **Color:** Matches the note text color
  - **Thickness:** 1 px
  - **Opacity:** 100%

### **Update config.toml**

```conf
[Languages.en]
title = "How to Write a Lab Guide"
weight = 1
languageName = "English"

[Languages.vi]
title = "Cách viết một Lab Guide"
weight = 2
languageName = "Tiếng Việt"
```

### References

[Create and organize content | Documentation for Hugo Learn Theme](https://learn.netlify.app/en/cont/)
