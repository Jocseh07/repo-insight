// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { relations } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTableCreator,
  text,
  timestamp,
  vector,
} from "drizzle-orm/pg-core";
import { v4 as uuidv4 } from "uuid";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `repo-insight_${name}`);

const createdAt = timestamp("created_at").defaultNow();
const updatedAt = timestamp("updated_at")
  .defaultNow()
  .$onUpdate(() => new Date());
const deletedAt = timestamp("deleted_at");

export const user = createTable(
  "user",
  {
    clerkId: text("id").notNull().primaryKey(),
    imageUrl: text("image_url"),
    email: text("email").notNull().unique(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    credits: integer("credits").notNull().default(150),
    githubToken: text("github_token"),

    createdAt,
    updatedAt,
  },
  (table) => {
    return {
      emailIndex: index("user_email_idx").on(table.email),
    };
  },
);

export const userRelations = relations(user, ({ many, one }) => ({
  projects: many(project),
  selectedProjects: one(selectedProject),
  questions: many(question),
}));

export const project = createTable(
  "project",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuidv4()),

    githubToken: text("github_token"),
    projectName: text("project_name").notNull(),
    repoUrl: text("project_url").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.clerkId),

    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => {
    return {
      idIndex: index("project_id_idx").on(table.id),
    };
  },
);

export const projectRelations = relations(project, ({ one, many }) => ({
  owner: one(user, {
    fields: [project.userId],
    references: [user.clerkId],
  }),
  selectedProjects: one(selectedProject),
  commits: many(commit),
  sourceCodeEmbeddings: many(sourceCodeEmbedding),
  notes: many(notes),
}));

export const commit = createTable(
  "commit",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuidv4()),

    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    commitMessage: text("commit_message").notNull(),
    commitHash: text("commit_hash").notNull(),
    commitAuthorName: text("commit_author_name").notNull(),
    commitAuthorEmail: text("commit_author_email").notNull(),
    commitAuthorAvatarUrl: text("commit_author_avatar_url").notNull(),
    commitAuthorDate: text("commit_author_date").notNull(),
    aiSummary: text("ai_summary"),

    createdAt,
    updatedAt,
  },
  (table) => {
    return {
      idIndex: index("commit_id_idx").on(table.id),
    };
  },
);

export const commitRelations = relations(commit, ({ one }) => ({
  project: one(project, {
    fields: [commit.projectId],
    references: [project.id],
  }),
}));

export const selectedProject = createTable(
  "selected_project",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuidv4()),

    projectId: text("project_id")
      .references(() => project.id, { onDelete: "cascade" })
      .default(""),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.clerkId, { onDelete: "no action" }),

    createdAt,
  },
  (table) => {
    return {
      idIndex: index("selected_project_id_idx").on(table.id),
    };
  },
);

export const selectedProjectRelations = relations(
  selectedProject,
  ({ one }) => ({
    project: one(project, {
      fields: [selectedProject.projectId],
      references: [project.id],
    }),
    owner: one(user, {
      fields: [selectedProject.userId],
      references: [user.clerkId],
    }),
  }),
);

export const sourceCodeEmbedding = createTable(
  "source_code_embedding",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuidv4()),
    summaryEmbedding: vector("summaryEmbedding", { dimensions: 768 }).notNull(),
    sourceCode: text("source_code").notNull(),
    fileName: text("file_name").notNull(),
    summary: text("summary").notNull(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),

    createdAt,
  },
  (table) => {
    return {
      idIndex: index("source_code_idx").on(table.id),
    };
  },
);

export const sourceCodeEmbeddingRelations = relations(
  sourceCodeEmbedding,
  ({ one }) => ({
    project: one(project, {
      fields: [sourceCodeEmbedding.projectId],
      references: [project.id],
    }),
  }),
);

export const question = createTable(
  "question",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuidv4()),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.clerkId, { onDelete: "no action" }),
    question: text("question").notNull(),
    answer: text("answer").notNull(),
    fileReferences: json("file_references").notNull(),

    createdAt,
  },
  (table) => {
    return {
      idIndex: index("question_idx").on(table.id),
    };
  },
);

export const answerRelations = relations(question, ({ one }) => ({
  project: one(project, {
    fields: [question.projectId],
    references: [project.id],
  }),
  user: one(user, {
    fields: [question.userId],
    references: [user.clerkId],
  }),
}));

export const notes = createTable(
  "notes",
  {
    id: text("id")
      .primaryKey()
      .$default(() => uuidv4()),

    userId: text("user_id")
      .notNull()
      .references(() => user.clerkId, { onDelete: "no action" }),
    title: text("name").notNull(),
    content: text("content").notNull(),
    repoId: text("repo_id").notNull(),
    repoName: text("repo_name").notNull(),
    repoOwner: text("repo_owner").notNull(),
    createdAt,
    updatedAt,
    deletedAt,
  },
  (table) => {
    return {
      idIndex: index("notes_id_idx").on(table.id),
    };
  },
);

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(user, {
    fields: [notes.userId],
    references: [user.clerkId],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Project = typeof project.$inferSelect;
export type NewProject = typeof project.$inferInsert;

export type Commit = typeof commit.$inferSelect;
export type NewCommit = typeof commit.$inferInsert;

export type SelectedProject = typeof selectedProject.$inferSelect;
export type NewSelectedProject = typeof selectedProject.$inferInsert;

export type Question = typeof question.$inferSelect;
export type NewQuestion = typeof question.$inferInsert;

export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
