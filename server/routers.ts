import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as menuStorage from "./menu-storage";
import { ImageUploadError, saveUploadedImage } from "./image-upload";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Menu API endpoints
  menu: router({
    // Upload an image from the admin panel and return its public URL.
    uploadImage: publicProcedure
      .input(z.object({
        dataUrl: z.string().max(21_000_000),
      }))
      .mutation(({ input }) => {
        try {
          return saveUploadedImage(input.dataUrl);
        } catch (error) {
          if (error instanceof ImageUploadError) {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: error.message,
            });
          }

          console.error("[Upload] Failed to save image:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "تعذر حفظ الصورة. حاول مرة أخرى.",
          });
        }
      }),

    // Get all categories
    getCategories: publicProcedure.query(() => {
      return menuStorage.getCategories();
    }),

    // Get all items
    getItems: publicProcedure.query(() => {
      return menuStorage.getItems();
    }),

    // Get items by category
    getItemsByCategory: publicProcedure
      .input(z.object({ categoryId: z.string() }))
      .query(({ input }) => {
        return menuStorage.getItemsByCategory(input.categoryId);
      }),

    // Update item (admin)
    updateItem: publicProcedure
      .input(z.object({
        id: z.string(),
        categoryId: z.string(),
        name: z.string(),
        nameAr: z.string().nullable().optional().default(''),
        nameEn: z.string().nullable().optional().default(''),
        price: z.number(),
        description: z.string().nullable().optional().default(''),
        descriptionAr: z.string().nullable().optional().default(''),
        descriptionEn: z.string().nullable().optional().default(''),
        image: z.string().nullable().optional().default(''),
      }))
      .mutation(({ input }) => {
        // Convert null to empty string
        const cleanedInput = {
          ...input,
          nameAr: input.nameAr || '',
          nameEn: input.nameEn || '',
          description: input.description || '',
          descriptionAr: input.descriptionAr || '',
          descriptionEn: input.descriptionEn || '',
          image: input.image || '',
        };
        return menuStorage.upsertItem(cleanedInput as any);
      }),

    // Add new item (admin)
    addItem: publicProcedure
      .input(z.object({
        categoryId: z.string(),
        name: z.string(),
        nameAr: z.string().nullable().optional().default(''),
        nameEn: z.string().nullable().optional().default(''),
        price: z.number(),
        description: z.string().nullable().optional().default(''),
        descriptionAr: z.string().nullable().optional().default(''),
        descriptionEn: z.string().nullable().optional().default(''),
        image: z.string().nullable().optional().default(''),
      }))
      .mutation(({ input }) => {
        const data = menuStorage.readMenuData();
        const newId = String(Math.max(...data.items.map(i => parseInt(i.id) || 0), 0) + 1);
        const newItem = {
          id: newId,
          categoryId: input.categoryId,
          name: input.name || '',
          nameAr: input.nameAr || '',
          nameEn: input.nameEn || '',
          price: input.price || 0,
          description: input.description || '',
          descriptionAr: input.descriptionAr || '',
          descriptionEn: input.descriptionEn || '',
          image: input.image || '',
        };
        return menuStorage.upsertItem(newItem as any);
      }),

    // Delete item (admin)
    deleteItem: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const success = menuStorage.deleteItem(input.id);
        return { success };
      }),

    // Reorder item within its category (admin)
    reorderItem: publicProcedure
      .input(z.object({ id: z.string(), direction: z.enum(['up', 'down']) }))
      .mutation(({ input }) => {
        return menuStorage.reorderItem(input.id, input.direction);
      }),

    // Update category (admin)
    updateCategory: publicProcedure
      .input(z.object({
        id: z.string(),
        name: z.string(),
        nameAr: z.string().nullable().optional().default(''),
        nameEn: z.string().nullable().optional().default(''),
        image: z.string().nullable().optional().default(''),
      }))
      .mutation(({ input }) => {
        const cleanedInput = {
          id: input.id,
          name: input.name || '',
          nameAr: input.nameAr || '',
          nameEn: input.nameEn || '',
          image: input.image || '',
        };
        return menuStorage.upsertCategory(cleanedInput as any);
      }),

    // Add new category (admin)
    addCategory: publicProcedure
      .input(z.object({
        name: z.string(),
        nameAr: z.string().nullable().optional().default(''),
        nameEn: z.string().nullable().optional().default(''),
        image: z.string().nullable().optional().default(''),
      }))
      .mutation(({ input }) => {
        const data = menuStorage.readMenuData();
        const newId = String(Math.max(...data.categories.map(c => parseInt(c.id) || 0), 0) + 1);
        const newCategory = {
          id: newId,
          name: input.name || '',
          nameAr: input.nameAr || '',
          nameEn: input.nameEn || '',
          image: input.image || '',
        };
        return menuStorage.upsertCategory(newCategory as any);
      }),

    // Delete category (admin)
    deleteCategory: publicProcedure
      .input(z.object({ id: z.string() }))
      .mutation(({ input }) => {
        const success = menuStorage.deleteCategory(input.id);
        return { success };
      }),

    // Get all menu data
    getAllData: publicProcedure.query(() => {
      return menuStorage.readMenuData();
    }),
  })
});

export type AppRouter = typeof appRouter;
