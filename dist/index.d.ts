/// <reference types="webpack" />
import { Plugin, Compiler } from 'webpack';
export * from './interfaces';
export interface SiteGeneratorWebpackPluginOptions {
    dataPath: string;
    prerender: boolean;
}
export declare class SiteGeneratorWebpackPlugin implements Plugin {
    private options;
    private startTime;
    private prevTimestamps;
    private absDataPath;
    private cachedHtml;
    constructor(options: SiteGeneratorWebpackPluginOptions);
    hasChanges(compilation: any): boolean;
    apply(compiler: Compiler): void;
}
