/**
 * JsonLd — injects a JSON-LD <script> tag into the page <head>.
 * Usage:
 *   import JsonLd from '@/components/JsonLd';
 *   <JsonLd schema={courseSchema({ ... })} />
 */

interface JsonLdProps {
  schema: object | object[];
}

export default function JsonLd({ schema }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
