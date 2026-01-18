export type Difficulty = "Easy" | "Medium" | "Hard";
export type Tag = "DSA" | "Arrays" | "DP" | "Graph" | "String" | "Math";

export interface Problem {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    tags: Tag[];
    description: string;
    solveRate: number;
    publishDate: string; // ISO date
}

export const problems: Problem[] = [
    {
        id: "1",
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "Easy",
        tags: ["DSA", "Arrays", "Math"],
        description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example 1:**
\`\`\`
Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
\`\`\`
    `,
        solveRate: 85,
        publishDate: "2024-05-01",
    },
    {
        id: "2",
        title: "Longest Substring Without Repeating Characters",
        slug: "longest-substring",
        difficulty: "Medium",
        tags: ["DSA", "String"],
        description: `Given a string \`s\`, find the length of the **longest substring** without repeating characters.

**Example 1:**
\`\`\`
Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.
\`\`\`
    `,
        solveRate: 45,
        publishDate: "2024-05-02",
    },
    {
        id: "3",
        title: "Median of Two Sorted Arrays",
        slug: "median-of-two-sorted-arrays",
        difficulty: "Hard",
        tags: ["DSA", "Arrays", "Math"],
        description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.

The overall run time complexity should be \`O(log (m+n))\`.
    `,
        solveRate: 30,
        publishDate: "2024-05-03",
    },
];
