import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity("carbon_footprint")
export class CarbonFootprintEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => IngredientEntity,
    ingredient => ingredient.footprint,
    { cascade: true }
  )
  ingredients: IngredientEntity[];

  @Column({
    type: "float",
    nullable: false,
  })
  value: number;

  constructor(props: {
    ingredients: IngredientEntity[];
    value: number;
  }) {
    super();
    this.ingredients = props?.ingredients;
    this.value = props?.value;
  }
}

@Entity("carbon_footprint_ingredient")
export class IngredientEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
  })
  quantity: number;

  @Column({
    nullable: false,
  })
  unit: string;

  @ManyToOne(
    () => CarbonFootprintEntity,
    footprint => footprint.ingredients
  )
  footprint: CarbonFootprintEntity;

  constructor(props: {
    name: string;
    quantity: number;
    unit: string;
  }) {
    super();
    this.name = props?.name;
    this.quantity = props?.quantity;
    this.unit = props?.unit;
  }
}
