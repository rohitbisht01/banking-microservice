import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Credential } from "./credential.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: "first_name" })
  first_name: string;

  @Column({ name: "last_name" })
  last_name: string;

  @Column({ unique: true })
  email: string;

  @OneToOne(() => Credential, (credential) => credential.user)
  credential: Credential;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
