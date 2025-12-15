export function buildCommentTree(comments: any[]) {
  const map: any = {};
  const roots: any[] = [];

  // 1. Initialize every comment with an empty 'children' array
  comments.forEach((comment) => {
    map[comment.id] = { ...comment, children: [] };
  });

  // 2. Link children to parents
  comments.forEach((comment) => {
    if (comment.parent_id) {
      // If it has a parent, add it to the parent's children list
      if (map[comment.parent_id]) {
        map[comment.parent_id].children.push(map[comment.id]);
      }
    } else {
      // If no parent, it's a "Root" comment (Top Level)
      roots.push(map[comment.id]);
    }
  });

  return roots;
}