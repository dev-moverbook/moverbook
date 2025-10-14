import { TableNames, Id, Doc } from "../_generated/dataModel";
import { DatabaseReader } from "../_generated/server";
import { validateDocExists } from "./validate";

type TablesWithCompanyId = {
  [K in TableNames]: Doc<K> extends { companyId: Id<"companies"> } ? K : never;
}[TableNames];

export async function getFirstByCompanyId<T extends TablesWithCompanyId>(
  db: DatabaseReader,
  table: T,
  companyId: Doc<T>["companyId"],
  errorMessage: string
): Promise<Doc<T>> {
  const document = await db
    .query(table)
    .filter((query) => query.eq(query.field("companyId"), companyId))
    .first();

  return validateDocExists(table, document, errorMessage);
}
type TablesWithCompanyAndActive = {
  [K in TableNames]: Doc<K> extends {
    companyId: Id<"companies">;
    isActive: boolean;
  }
    ? K
    : never;
}[TableNames];

export async function getActiveByCompany<T extends TablesWithCompanyAndActive>(
  db: DatabaseReader,
  table: T,
  companyId: Doc<T>["companyId"],
  isActive: boolean = true
): Promise<Doc<T>[]> {
  return db
    .query(table)
    .filter((q) =>
      q.and(
        q.eq(q.field("companyId"), companyId),
        q.eq(q.field("isActive"), isActive as Doc<T>["isActive"])
      )
    )
    .collect();
}
