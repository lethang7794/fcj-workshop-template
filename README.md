# A template for workshop of [First Cloud Journey](https://cloudjourney.awsstudygroup.com/)

> [!NOTE]
> This template is based on the [original example workshop](https://van-hoang-kha.github.io/2-prerequiste/2.1-downloadhugotheme/), but:
>
> - Works with current version of Hugo (`v0.147.9` at 2025-07-01), see [1](#the-problem-of-the-original-example-workshop)
> - Has some improvement, see [2](#improvement-from-original-example-workshop)

---

<details>
<summary>
The problem of the original example workshop
</summary>

The [example workshop](https://van-hoang-kha.github.io/2-prerequiste/2.1-downloadhugotheme/) in [Guide for building a workshop](https://van-hoang-kha.github.io/) for First Cloud Journey is current broken because:

1. Somehow new version of Hugo (hugo `v0.144.2` on Linux) can't parse the `date` front-matter field.

   ![1](https://i.imgur.com/iRqWHfB.png)

2. `.Site.IsMultiLingual` (used in `hugo-theme-learn`) was deprecated in Hugo v0.124.0 and will be removed in Hugo 0.137.0 ([Source](https://github.com/gohugoio/hugo/pull/12887))

   ![2](https://i.imgur.com/utrovTV.png)

### The solution

| Problem                                      | Solution                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. `date` front-matter field can't be parsed | This is the first time I use Hugo, I've tried but didn't success to fix this. <br/> For the purpose of viewing this example workshop, I've removed all the `date` field as in [commit 2a39eb2](https://github.com/lethang7794/fcj-example-workshop/commit/2a39eb2f63957454c15295888c8213c785d1c7dc). |
| 2. `.Site.IsMultiLingual` is removed.        | I've replace all `.Site.IsMultiLingual` with `hugo.IsMultilingual` as in [commit 265dc2a](https://github.com/lethang7794/fcj-example-workshop/commit/265dc2a23533dbd2c368a3c4df844d249630f559).                                                                                                      |

</details>

<details>
<summary>
Improvement from original example workshop
</summary>

- Support markdown syntax for Alert (you don't need to use Hugo's notice).

- Automated create Table of content for each section.

- Support shortcode for creating table of content for a page.

- Preview markdown images in IDE (you don't need to run `hugo server`).

- Include a GitHub Action workflow to publish the workshop as GitHub Page.

</details>

<details><summary>
How to use this example workshop
</summary>

1. Use this workshop as a template

   [Click this link to create a GitHub repository using this template](https://github.com/new?template_name=fcj-example-workshop&template_owner=lethang7794)

2. Download example workshop

   [Click this link to download the example workshop as a zip file](https://github.com/lethang7794/fcj-example-workshop/archive/refs/heads/main.zip).

</details>

<details>
<summary>
How to publish this workshop as a GitHub Page?
</summary>

The only thing you need to do is verify the repository has Pages enabled and configured to build using GitHub Actions.

- Open your GitHub repository's _Setting_ tab.
- Under _Code and automation_ group, open _Pages_ section.
- Under _Build and deployment_, select _GitHub Actions_ as the _Source_.

</details>
