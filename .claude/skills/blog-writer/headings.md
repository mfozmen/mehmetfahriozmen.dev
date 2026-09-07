# Section headings — mehmetfahriozmen.dev

Headings are read in one pass, from a table of contents or while scrolling. They are labels, not summaries. This file is the whole rulebook for them; `blog-writer` points here.

## Rules

**Two to four words.** A heading carrying a verb and a clause is a summary of the section, and the section already does that job. Cut to the noun the section is about. Past four words the reader re-reads it on the way past, which is the opposite of what a heading is for.

> ❌ "The question I left open" → ✅ "The open question"
>
> ❌ "The agent that knew who we'd break" → ✅ "The agents"

**Name what the whole section is about.** "The blast radius" was a good two-word heading for the impact-analysis agent, and wrong for the section, which covered four agents. Before settling on a heading, check the last paragraph of the section as well as the first.

**Name the thing, don't describe it.** If the section is about impact analysis, use the phrase engineers already say for it. A known two-word term beats an accurate seven-word description — including for non-native readers, who recognise the term but have to parse the description.

**Don't spend the punchline.** If the heading states the section's finding, the reader arrives already told. Point at the subject; let the prose land the hit.

**Don't repeat the opening blockquote.** If the post opens with `"Who else uses this?"`, that is not also the first heading.

**Sentence case.** "The open question", not "The Open Question". Two April 2026 posts use Title Case; everything since is sentence case, and a post must be internally consistent.

**A fragment is fine, a question usually isn't.** Noun phrases carry the corpus ("The meeting room", "What gets caught", "Sideways"). A heading that asks a question makes a promise the section has to answer in the first paragraph.

**No numbering, no colons, no "Part 2:".** The order is the order.

**`##` only.** h1 is the auto-generated post title; h3 is rare and needs a reason.

## Audit pass

Run this on a finished draft, headings only — read them as a list, without the prose:

1. Extract them: `grep -n "^## " content/posts/<slug>.mdx`
2. Word-count each. Anything over four words gets rewritten or justified out loud.
3. Read the list top to bottom as if it were a table of contents. Does it tell the arc of the post? A reader who only sees these should know what the post is about and want the first section.
4. Look for two headings that could be swapped without anyone noticing — that is usually two sections that should be one, or a section with no thesis.
5. Check for a heading that answers what its section exists to reveal, and for one that echoes the opening blockquote or the post title.
6. Check case consistency across the whole post.

Report as a table: heading, word count, verdict, suggested replacement. Do not rewrite the prose in a heading audit — headings only, so they can be judged on their own.

## Corpus

Good, for calibration: "The meeting room", "What gets caught", "The open question", "The agents", "Sideways", "Abundant, scarce", "The map".

These rules are for Field Notes. Lab Day headings render in mono uppercase and have their own limit (under 30 characters, in the lab-day skill); the spirit is the same.

Long ones that survived because the length *is* the joke are rare — if you think you have one, say why before keeping it.
