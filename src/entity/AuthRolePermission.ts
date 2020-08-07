import { Column, Entity } from "typeorm";

@Entity("auth_role_permission", { schema: "nestjs" })
export class AuthRolePermission {
  @Column("int", { primary: true, name: "role_id", comment: "角色id" })
  roleId: number;

  @Column("varchar", {
    primary: true,
    name: "code",
    comment: "权限code",
    length: 225,
  })
  code: string;

  @Column("timestamp", {
    name: "created",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  created: Date | null;

  @Column("timestamp", {
    name: "updated",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  updated: Date | null;
}
