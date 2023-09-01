import { generateEntityId, PriceListUtils } from "@medusajs/utils"
import {
  BeforeCreate,
  Cascade,
  Entity,
  Enum,
  Index,
  OneToMany,
  OptionalProps,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"
import MoneyAmount from "./money-amount"

type OptionalRelations = "prices"
type OptionalFields =
  | "type"
  | "status"
  | "starts_at"
  | "ends_at"
  | "created_at"
  | "updated_at"

@Entity()
class PriceList {
  [OptionalProps]?: OptionalRelations | OptionalFields

  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  name: string

  @Property({ columnType: "text" })
  description: string

  @Enum({
    items: () => PriceListUtils.PriceListType,
    default: PriceListUtils.PriceListType.SALE,
  })
  type: PriceListUtils.PriceListType

  @Enum({
    items: () => PriceListUtils.PriceListStatus,
    default: PriceListUtils.PriceListStatus.DRAFT,
  })
  status: PriceListUtils.PriceListStatus

  @Property({ columnType: "timestamptz", nullable: true })
  starts_at: Date | null

  @Property({ columnType: "timestamptz", nullable: true })
  ends_at: Date | null

  @OneToMany({ entity: () => MoneyAmount, mappedBy: "price_list", orphanRemoval: true })
  prices: MoneyAmount[]

  @Property({ onCreate: () => new Date(), columnType: "timestamptz" })
  created_at: Date

  @Property({
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
    columnType: "timestamptz",
  })
  updated_at: Date

  @Index({ name: "IDX_product_deleted_at" })
  @Property({ columnType: "timestamptz", nullable: true })
  deleted_at?: Date

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "pl")
  }
}

export default PriceList