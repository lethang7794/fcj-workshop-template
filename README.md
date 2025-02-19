# A fix for the example workshop of Building a workshop for First Cloud Journey

## The problem

The [example workshop](https://van-hoang-kha.github.io/2-prerequiste/2.1-downloadhugotheme/) in [Guide for building a workshop](https://van-hoang-kha.github.io/) for First Cloud Journey is current broken because:

1. Somehow new version of Hugo (hugo `v0.144.2` on Linux) can't parse the `date` front-matter field.

   ![1](https://i.imgur.com/iRqWHfB.png)

2. `.Site.IsMultiLingual` (used in `hugo-theme-learn`) was deprecated in Hugo v0.124.0 and will be removed in Hugo 0.137.0 ([Source](https://github.com/gohugoio/hugo/pull/12887))

   ![2](https://i.imgur.com/utrovTV.png)

## The solution

| Problem                                      | Solution                                                                                                                                                                                                                                                                                             |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. `date` front-matter field can't be parsed | This is the first time I use Hugo, I've tried but didn't success to fix this. <br/> For the purpose of viewing this example workshop, I've removed all the `date` field as in [commit 2a39eb2](https://github.com/lethang7794/fcj-example-workshop/commit/2a39eb2f63957454c15295888c8213c785d1c7dc). |
| 2. `.Site.IsMultiLingual` is removed.        | I've replace all `.Site.IsMultiLingual` with `hugo.IsMultilingual` as in [commit 265dc2a](https://github.com/lethang7794/fcj-example-workshop/commit/265dc2a23533dbd2c368a3c4df844d249630f559).                                                                                                      |

## How to download the fixed example workshop

From this [link](https://github.com/lethang7794/fcj-example-workshop/archive/refs/heads/main.zip).
