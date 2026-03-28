import { useState } from 'react'
import TokenizeHeader from './components/TokenizeHeader'
import ProjectCard from './components/ProjectCard'
import emptyIcon from '../../assets/bg-svg/empty.svg'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from '../../components/ui/pagination'
import { useProjectList } from '../../hooks/useProjectList'

const PAGE_SIZE = 10

export default function Tokenize() {
  const [activeTab, setActiveTab] = useState('all')
  const [pageIndex, setPageIndex] = useState(1)

  const { data, total, loading } = useProjectList(activeTab, pageIndex, PAGE_SIZE)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setPageIndex(1)
  }

  const counts = { all: total, tokenized: 0, reviewing: 0, rejected: 0 }

  const renderPageNumbers = () => {
    const pages = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
      return pages.map((p) => (
        <PaginationItem key={p}>
          <PaginationLink
            href="#"
            isActive={p === pageIndex}
            onClick={(e) => { e.preventDefault(); setPageIndex(p) }}
          >
            {p}
          </PaginationLink>
        </PaginationItem>
      ))
    }
    return (
      <>
        <PaginationItem>
          <PaginationLink href="#" isActive={pageIndex === 1} onClick={(e) => { e.preventDefault(); setPageIndex(1) }}>1</PaginationLink>
        </PaginationItem>
        {pageIndex > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
        {Array.from({ length: 3 }, (_, i) => pageIndex - 1 + i)
          .filter((p) => p > 1 && p < totalPages)
          .map((p) => (
            <PaginationItem key={p}>
              <PaginationLink href="#" isActive={p === pageIndex} onClick={(e) => { e.preventDefault(); setPageIndex(p) }}>{p}</PaginationLink>
            </PaginationItem>
          ))}
        {pageIndex < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
        <PaginationItem>
          <PaginationLink href="#" isActive={pageIndex === totalPages} onClick={(e) => { e.preventDefault(); setPageIndex(totalPages) }}>{totalPages}</PaginationLink>
        </PaginationItem>
      </>
    )
  }

  return (
    <div style={{ padding: '0 24px' }}>
      <TokenizeHeader activeTab={activeTab} onTabChange={handleTabChange} counts={counts} />

      {loading && (
        <div className="flex items-center justify-center py-16 text-gray-400 text-sm">Loading...</div>
      )}

      {!loading && data.length === 0 && (
        <div className="flex flex-col items-center justify-center" style={{ paddingTop: '60px' }}>
          <img src={emptyIcon} alt="No data" style={{ width: '320px', height: '320px' }} />
        </div>
      )}

      {!loading && data.length > 0 && (
        <>
          <div>
            {data.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination className="mt-6 mb-4">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (pageIndex > 1) setPageIndex(pageIndex - 1) }}
                    className={pageIndex === 1 ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
                {renderPageNumbers()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (pageIndex < totalPages) setPageIndex(pageIndex + 1) }}
                    className={pageIndex === totalPages ? 'pointer-events-none opacity-50' : ''}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}
