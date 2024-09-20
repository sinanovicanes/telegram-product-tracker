import { userRepository } from "@/database";
import { Injectable } from "@app/common/decorators";

@Injectable()
export class UserService {
  async getUser(userId: string) {
    return userRepository.findOneBy({ id: userId });
  }

  async createUser(userId: string) {
    const user = userRepository.create({
      id: userId
    });

    await userRepository.save(user);

    return user;
  }

  async deleteUser(userId: string) {
    const results = await userRepository.delete({ id: userId });

    return results.affected;
  }
}
