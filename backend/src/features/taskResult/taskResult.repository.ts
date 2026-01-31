import { prisma } from "../../database/client";
import { TaskResultPublicDTO, UpdateTaskResultDTO } from "@shared/src/types/taskResult.types";
import { taskResultPublicSelect } from "./taskResult.select";
import { TaskResultStatus } from "@shared/src/enums/taskResult.enum";

export const TaskResultRepository = {
    async upsert(contentId: number, userId: number): Promise<TaskResultPublicDTO> {
        return prisma.taskResult.upsert({
            where: {
                userId_contentId: {
                    contentId,
                    userId
                }
            },
            create: {
                userId,
                contentId,
                status: TaskResultStatus.NOT_TAKEN,
                reviews: ''
            },
            update: {},
            select: taskResultPublicSelect
        })
    },

    async findByUserIdsAndContentIds({userIds, contentIds}: {userIds?: number[], contentIds?: number[]}): Promise<TaskResultPublicDTO[]> {
        return prisma.taskResult.findMany({
            where: {
                deletedAt: null,
                ...(userIds && { userId: { in: userIds }}),
                ...(contentIds && { contentId: { in: contentIds }}),
            },
            select: taskResultPublicSelect,
        });
    },

    async updateTaskResult(contentId: number, userId: number, data: UpdateTaskResultDTO): Promise<TaskResultPublicDTO> {
        return prisma.taskResult.update({
            where: {
                userId_contentId: {
                    contentId,
                    userId
                }
            },
            data,
            select: taskResultPublicSelect
        })
    },

    async deleteInvalidTaskResult(contentId: number, userIds: number[]): Promise<number> {
        return prisma.taskResult.updateMany({
            where: {
                contentId,
                userId: { notIn: userIds },
            },
            data: {
                deletedAt: new Date()
            }
        }).then(result => result.count);
    }
};
