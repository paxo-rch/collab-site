import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userName: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column()
  public profilePicturePath: string

  @column()
  public email: string

  @column({ serialize: (value) => Number(value) })
  public numberOfUploads: number

  @column()
  public class: string

  @column({ serialize: (value) => value.toFormat('hh:mm dd/LL/yyyy') })
  public lastLoginAt: DateTime

  @column.dateTime({ autoCreate: true, serialize: (value) => value.toFormat('hh:mm dd/LL/yyyy') })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true, serialize: (value) => value.toFormat('hh:mm dd/LL/yyyy') })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (User: User) {
    if (User.$dirty.password) {
      User.password = await Hash.make(User.password)
    }
  }
}
